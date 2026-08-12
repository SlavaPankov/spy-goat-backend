import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { EErrorMessages } from '../types/enums/errorMessage';
import { Friendship, FriendshipStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { FriendDto, FriendshipActionDto, IncomingFriendRequestDto, OutgoingFriendRequestDto } from './dto/friend.dto';
import { FriendshipStatusNotificationWith, FriendshipStatusWith } from './types/friendship-status-with.type';

@Injectable()
export class FriendService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService
  ) {}

  private async updateRequestStatus(
    userId: string,
    friendshipId: string,
    friendshipStatus: FriendshipStatus,
    type?: string
  ) {
    const friendship = await this.prismaService.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (friendship?.addresseeId !== userId || friendship.status !== FriendshipStatus.PENDING) {
      throw new NotFoundException(EErrorMessages.FRIENDS_REQUEST_NOT_FOUND);
    }

    const updated = await this.prismaService.friendship.update({
      where: { id: friendshipId },
      data: { status: friendshipStatus },
      include: { requester: { select: this.userSelect }, addressee: { select: this.userSelect } },
    });

    if (friendshipStatus === FriendshipStatus.ACCEPTED && type) {
      await this.notificationService.create(
        updated.requesterId,
        type,
        this.buildFriendPayload(updated, updated.requesterId)
      );
    }

    return this.toActionDto(updated, userId);
  }

  private readonly userSelect = { id: true, username: true, isOnline: true, lastSeenAt: true } as const;

  private toActionDto(
    friendship: Friendship & {
      requester: { id: string; username: string; isOnline: boolean; lastSeenAt: Date | null };
      addressee: { id: string; username: string; isOnline: boolean; lastSeenAt: Date | null };
    },
    callerId: string
  ) {
    const otherUser = friendship.requesterId === callerId ? friendship.addressee : friendship.requester;

    return plainToInstance(
      FriendshipActionDto,
      { id: friendship.id, status: friendship.status, createdAt: friendship.createdAt, otherUser },
      { excludeExtraneousValues: true }
    );
  }

  private buildFriendPayload(
    friendship: Friendship & {
      requester: { id: string; username: string; isOnline: boolean; lastSeenAt: Date | null };
      addressee: { id: string; username: string; isOnline: boolean; lastSeenAt: Date | null };
    },
    recipientId: string
  ) {
    const otherUser = friendship.requesterId === recipientId ? friendship.addressee : friendship.requester;

    return {
      friendshipId: friendship.id,
      otherUser: {
        id: otherUser.id,
        username: otherUser.username,
        isOnline: otherUser.isOnline,
        lastSeenAt: otherUser.lastSeenAt,
      },
    };
  }

  async sendRequest(requesterId: string, addresseeId: string) {
    if (requesterId === addresseeId) {
      throw new BadRequestException(EErrorMessages.NOT_ALLOWED_SELF_FRIEND);
    }

    const include = { requester: { select: this.userSelect }, addressee: { select: this.userSelect } };

    const [ownDirection, reverseDirection] = await Promise.all([
      this.prismaService.friendship.findUnique({
        where: { requesterId_addresseeId: { requesterId, addresseeId } },
        include,
      }),
      this.prismaService.friendship.findUnique({
        where: { requesterId_addresseeId: { requesterId: addresseeId, addresseeId: requesterId } },
        include,
      }),
    ]);

    if (reverseDirection?.status === FriendshipStatus.PENDING) {
      const accepted = await this.prismaService.friendship.update({
        where: { id: reverseDirection.id },
        data: { status: FriendshipStatus.ACCEPTED },
        include,
      });

      await this.notificationService.create(
        reverseDirection.requesterId,
        'FRIEND_ACCEPTED',
        this.buildFriendPayload(accepted, reverseDirection.requesterId)
      );

      return this.toActionDto(accepted, requesterId);
    }

    if (reverseDirection?.status === FriendshipStatus.ACCEPTED || ownDirection?.status === FriendshipStatus.ACCEPTED) {
      return this.toActionDto((ownDirection ?? reverseDirection)!, requesterId);
    }

    if (ownDirection?.status === FriendshipStatus.PENDING) {
      return this.toActionDto(ownDirection, requesterId);
    }

    if (ownDirection?.status === FriendshipStatus.DECLINED) {
      const reopened = await this.prismaService.friendship.update({
        where: { id: ownDirection.id },
        data: { status: FriendshipStatus.PENDING },
        include,
      });

      await this.notificationService.create(
        addresseeId,
        'FRIEND_REQUEST',
        this.buildFriendPayload(reopened, addresseeId)
      );

      return this.toActionDto(reopened, requesterId);
    }

    const created = await this.prismaService.friendship.create({
      data: { requesterId, addresseeId },
      include,
    });

    await this.notificationService.create(addresseeId, 'FRIEND_REQUEST', this.buildFriendPayload(created, addresseeId));

    return this.toActionDto(created, requesterId);
  }

  async acceptRequest(userId: string, friendshipId: string) {
    return this.updateRequestStatus(userId, friendshipId, FriendshipStatus.ACCEPTED, 'FRIEND_ACCEPTED');
  }

  async declineRequest(userId: string, friendshipId: string) {
    return this.updateRequestStatus(userId, friendshipId, FriendshipStatus.DECLINED);
  }

  async removeFriend(userId: string, friendshipId: string) {
    const friendship = await this.prismaService.friendship.findUnique({
      where: { id: friendshipId },
      include: { requester: { select: this.userSelect }, addressee: { select: this.userSelect } },
    });

    if (
      friendship?.status !== FriendshipStatus.ACCEPTED ||
      (friendship.addresseeId !== userId && friendship.requesterId !== userId)
    ) {
      throw new NotFoundException(EErrorMessages.NOT_YOUR_FRIENDS);
    }

    const dto = this.toActionDto(friendship, userId);

    await this.prismaService.friendship.delete({ where: { id: friendshipId } });

    return dto;
  }

  async listFriends(userId: string) {
    const friendships = await this.prismaService.friendship.findMany({
      where: {
        status: FriendshipStatus.ACCEPTED,
        OR: [
          {
            addresseeId: userId,
          },
          {
            requesterId: userId,
          },
        ],
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            isOnline: true,
            lastSeenAt: true,
          },
        },
        addressee: {
          select: {
            id: true,
            username: true,
            isOnline: true,
            lastSeenAt: true,
          },
        },
      },
    });

    return plainToInstance(
      FriendDto,
      friendships.map((f) => ({
        id: f.id,
        createdAt: f.createdAt,
        friend: f.requesterId === userId ? f.addressee : f.requester,
      })),
      { excludeExtraneousValues: true }
    );
  }

  async listIncoming(userId: string) {
    const requests = await this.prismaService.friendship.findMany({
      where: {
        status: FriendshipStatus.PENDING,
        addresseeId: userId,
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            isOnline: true,
            lastSeenAt: true,
          },
        },
      },
    });

    return plainToInstance(
      IncomingFriendRequestDto,
      requests.map((r) => ({
        id: r.id,
        createdAt: r.createdAt,
        fromUser: r.requester,
      })),
      { excludeExtraneousValues: true }
    );
  }

  async listOutgoing(userId: string) {
    const requests = await this.prismaService.friendship.findMany({
      where: {
        status: FriendshipStatus.PENDING,
        requesterId: userId,
      },
      include: {
        addressee: {
          select: {
            id: true,
            username: true,
            isOnline: true,
            lastSeenAt: true,
          },
        },
      },
    });

    return plainToInstance(
      OutgoingFriendRequestDto,
      requests.map((r) => ({
        id: r.id,
        createdAt: r.createdAt,
        toUser: r.addressee,
      })),
      { excludeExtraneousValues: true }
    );
  }

  async getStatusWith(userId: string, otherUserId: string): Promise<FriendshipStatusWith> {
    if (userId === otherUserId) {
      return { status: 'SELF' };
    }

    const [ownDirection, reverseDirection] = await Promise.all([
      this.prismaService.friendship.findUnique({
        where: { requesterId_addresseeId: { requesterId: userId, addresseeId: otherUserId } },
      }),
      this.prismaService.friendship.findUnique({
        where: { requesterId_addresseeId: { requesterId: otherUserId, addresseeId: userId } },
      }),
    ]);

    const friendship = ownDirection ?? reverseDirection;

    if (!friendship) {
      return { status: 'NONE' };
    }

    if (friendship.status === FriendshipStatus.ACCEPTED) {
      return { status: 'FRIENDS', friendshipId: friendship.id };
    }

    if (friendship.status === FriendshipStatus.DECLINED) {
      return { status: 'DECLINED', friendshipId: friendship.id };
    }

    return {
      status: ownDirection ? 'OUTGOING_PENDING' : 'INCOMING_PENDING',
      friendshipId: friendship.id,
    };
  }

  async getFriendRequestStatusForNotification(
    userId: string,
    notificationId: string
  ): Promise<FriendshipStatusNotificationWith> {
    const notification = await this.prismaService.notification.findUnique({ where: { id: notificationId } });

    if (notification?.userId !== userId || notification.type !== 'FRIEND_REQUEST') {
      return { status: 'NONE' };
    }

    const friendshipId = (notification.payload as { friendshipId?: string } | null)?.friendshipId;
    if (!friendshipId) return { status: 'NONE' };

    const supersededBy = await this.prismaService.notification.findFirst({
      where: {
        userId,
        type: 'FRIEND_REQUEST',
        payload: { path: ['friendshipId'], equals: friendshipId },
        createdAt: { gt: notification.createdAt },
      },
      select: { id: true },
    });

    if (supersededBy) {
      return { status: 'NONE' };
    }

    const friendship = await this.prismaService.friendship.findUnique({ where: { id: friendshipId } });

    if (friendship?.addresseeId !== userId) {
      return { status: 'NONE' };
    }

    if (friendship.status === FriendshipStatus.ACCEPTED) {
      return { status: 'FRIENDS' };
    }

    if (friendship.status !== FriendshipStatus.PENDING) {
      return { status: 'NONE' };
    }

    return { status: 'PENDING', friendshipId: friendship.id };
  }
}
