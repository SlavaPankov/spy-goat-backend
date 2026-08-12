export type FriendshipStatusWith =
  | { status: 'SELF' }
  | { status: 'NONE' }
  | { status: 'FRIENDS'; friendshipId: string }
  | { status: 'OUTGOING_PENDING'; friendshipId: string }
  | { status: 'INCOMING_PENDING'; friendshipId: string }
  | { status: 'DECLINED'; friendshipId: string };

export type FriendshipStatusNotificationWith =
  | { status: 'NONE' }
  | { status: 'FRIENDS' }
  | { status: 'PENDING'; friendshipId: string };
