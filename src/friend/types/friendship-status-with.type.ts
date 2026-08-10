export type FriendshipStatusWith =
  | { status: 'SELF' }
  | { status: 'NONE' }
  | { status: 'FRIENDS'; friendshipId: string }
  | { status: 'OUTGOING_PENDING'; friendshipId: string }
  | { status: 'INCOMING_PENDING'; friendshipId: string }
  | { status: 'DECLINED'; friendshipId: string };
