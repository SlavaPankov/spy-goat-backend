import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoomService } from '../room/room.service';
import { NotificationService } from '../notification/notification.service';
import { EErrorMessages } from '../types/enums/errorMessage';
import { RoomInvite, RoomInviteStatus, RoomStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { RoomInviteActionDto } from './dto/room-invite-action.dto';
import { RoomInviteStatusWithType } from './dto/room-invite-status-with.type';

@Injectable()
export class RoomInviteService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly roomService: RoomService,
    private readonly notificationService: NotificationService
  ) {}

  private readonly userSelect = { id: true, username: true, isOnline: true, lastSeenAt: true } as const;

  private toActionDto(
    invite: RoomInvite & {
      room: { name: string };
      inviter: { id: string; username: string; isOnline: boolean; lastSeenAt: Date | null };
      invitee: { id: string; username: string; isOnline: boolean; lastSeenAt: Date | null };
    },
    callerId: string
  ) {
    const otherUser = invite.inviterId === callerId ? invite.invitee : invite.inviter;

    return plainToInstance(
      RoomInviteActionDto,
      {
        id: invite.id,
        status: invite.status,
        createdAt: invite.createdAt,
        roomId: invite.roomId,
        roomName: invite.room.name,
        otherUser,
      },
      { excludeExtraneousValues: true }
    );
  }

  async invite(inviterId: string, roomId: string, inviteeId: string) {
    if (inviterId === inviteeId) {
      throw new BadRequestException(EErrorMessages.NOT_ALLOWED_SELF_INVITE);
    }

    const room = await this.prismaService.room.findUnique({
      where: { id: roomId },
      include: {
        players: { select: { userId: true } },
        creator: { select: this.userSelect },
      },
    });

    if (!room) {
      throw new NotFoundException(EErrorMessages.ROOM_NOT_FOUND);
    }

    if (room.creatorId !== inviterId) {
      throw new ForbiddenException(EErrorMessages.ROOM_NOT_ALLOWED);
    }

    if (room.status !== RoomStatus.WAITING) {
      throw new BadRequestException(EErrorMessages.ROOM_ALREADY_STARTED);
    }

    if (room.currentPlayers >= room.maxPlayers) {
      throw new BadRequestException(EErrorMessages.ROOM_IS_FULL);
    }

    if (room.players.some((p) => p.userId === inviteeId)) {
      throw new BadRequestException(EErrorMessages.ALREADY_IN_ROOM);
    }

    const invite = await this.prismaService.roomInvite.upsert({
      where: { roomId_inviteeId: { roomId, inviteeId } },
      update: { status: RoomInviteStatus.PENDING, inviterId },
      create: { roomId, inviterId, inviteeId },
      include: {
        room: { select: { name: true } },
        inviter: { select: this.userSelect },
        invitee: { select: this.userSelect },
      },
    });

    await this.notificationService.create(inviteeId, 'ROOM_INVITE', {
      inviteId: invite.id,
      roomId: room.id,
      roomName: room.name,
      otherUser: room.creator,
    });

    return this.toActionDto(invite, inviterId);
  }

  async acceptInvite(userId: string, inviteId: string) {
    const invite = await this.prismaService.roomInvite.findUnique({
      where: { id: inviteId },
    });

    if (invite?.inviteeId !== userId || invite.status !== RoomInviteStatus.PENDING) {
      throw new NotFoundException(EErrorMessages.ROOM_INVITE_NOT_FOUND);
    }

    await this.roomService.join(invite.roomId, userId);
    await this.roomService.notifyPlayerJoined(invite.roomId);

    const updated = await this.prismaService.roomInvite.update({
      where: { id: inviteId },
      data: { status: RoomInviteStatus.ACCEPTED },
      include: {
        room: { select: { name: true } },
        inviter: { select: this.userSelect },
        invitee: { select: this.userSelect },
      },
    });

    return this.toActionDto(updated, userId);
  }

  async declineInvite(userId: string, inviteId: string) {
    const invite = await this.prismaService.roomInvite.findUnique({
      where: { id: inviteId },
    });

    if (invite?.inviteeId !== userId || invite.status !== RoomInviteStatus.PENDING) {
      throw new NotFoundException(EErrorMessages.ROOM_INVITE_NOT_FOUND);
    }

    const updated = await this.prismaService.roomInvite.update({
      where: { id: inviteId },
      data: { status: RoomInviteStatus.DECLINED },
      include: {
        room: { select: { name: true } },
        inviter: { select: this.userSelect },
        invitee: { select: this.userSelect },
      },
    });

    return this.toActionDto(updated, userId);
  }

  async getInviteStatusForNotification(userId: string, notificationId: string): Promise<RoomInviteStatusWithType> {
    const notification = await this.prismaService.notification.findUnique({ where: { id: notificationId } });

    if (notification?.userId !== userId || notification.type !== 'ROOM_INVITE') {
      return { status: 'NONE' };
    }

    const inviteId = (notification.payload as { inviteId?: string } | null)?.inviteId;
    if (!inviteId) {
      return { status: 'NONE' };
    }

    const supersededBy = await this.prismaService.notification.findFirst({
      where: {
        userId,
        type: 'ROOM_INVITE',
        payload: { path: ['inviteId'], equals: inviteId },
        createdAt: { gt: notification.createdAt },
      },
      select: { id: true },
    });

    if (supersededBy) {
      return { status: 'NONE' };
    }

    const invite = await this.prismaService.roomInvite.findUnique({ where: { id: inviteId } });

    if (invite?.inviteeId !== userId || invite.status !== RoomInviteStatus.PENDING) {
      return { status: 'NONE' };
    }

    const player = await this.prismaService.player.findFirst({
      where: { roomId: invite.roomId, userId },
      select: { id: true },
    });

    if (player) return { status: 'IN_ROOM' };

    return { status: 'PENDING', inviteId: invite.id };
  }

  async getInviteStatusByRoomId(roomId: string, targetUserId: string): Promise<RoomInviteStatusWithType> {
    const [player, invite] = await Promise.all([
      this.prismaService.player.findFirst({
        where: { roomId, userId: targetUserId },
        select: { id: true },
      }),
      this.prismaService.roomInvite.findUnique({
        where: { roomId_inviteeId: { roomId, inviteeId: targetUserId } },
      }),
    ]);

    if (player) {
      return { status: 'IN_ROOM' };
    }

    if (!invite || invite.status !== RoomInviteStatus.PENDING) {
      return { status: 'NONE' };
    }

    return { status: 'PENDING', inviteId: invite.id };
  }
}
