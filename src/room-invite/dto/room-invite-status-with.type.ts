export type RoomInviteStatusWithType =
  | { status: 'IN_ROOM' }
  | { status: 'NONE'; inviteId?: string }
  | { status: 'PENDING'; inviteId: string };
