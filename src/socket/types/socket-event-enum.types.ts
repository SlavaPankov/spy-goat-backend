export const enum SocketEvent {
  // Room -> Server
  ROOM_SUBSCRIBE = 'room:subscribe',
  ROOM_JOIN = 'room:join',
  ROOM_EXIT = 'room:exit',
  ROOM_READY = 'room:ready',
  ROOM_GET_STATE = 'room:getState',

  // Room -> Client
  ROOM_SUBSCRIBED = 'room:subscribed',
  ROOM_PLAYER_JOINED = 'room:playerJoined',
  ROOM_PLAYER_JOINED_ERROR = 'room:playerJoinedError',
  ROOM_PLAYER_LEAVE = 'room:playerLeave',
  ROOM_PLAYER_LEAVE_ERROR = 'room:playerLeaveError',
  ROOM_YOU_LEAVE = 'room:youLeave',
  ROOM_PLAYER_READY = 'room:playerReady',
  ROOM_PLAYER_READY_ERROR = 'room:playerReadyError',
  ROOM_PLAYER_UPDATED = 'room:playerUpdated',
  ROOM_STATS_UPDATED = 'room:statsUpdated',
  ROOM_STATE_CHANGED = 'room:stateChanged',
  ROOM_STATE_CHANGED_ERROR = 'room:stateChangedError',

  // Game -> Server
  GAME_START = 'game:start',
  GAME_GET_STATE = 'game:getState',
  GAME_SELECT_CARD = 'game:selectCard',
  GAME_CONFIRM_CARD = 'game:confirmCard',
  GAME_DECLINE_CARD = 'game:declineCard',
  GAME_CHOOSE_ROW = 'game:chooseRow',

  // Game -> Client
  GAME_STARTED = 'game:started',
  GAME_STARTED_ERROR = 'game:startedError',
  GAME_STATE_CHANGED = 'game:stateChanged',
  GAME_CARD_SELECTED = 'game:cardSelected',
  GAME_CARD_CONFIRMED = 'game:cardConfirmed',
  GAME_CARD_DECLINED = 'game:cardDeclined',
  GAME_CARDS_REVEALED = 'game:cardsRevealed',
  GAME_ROW_CHOSEN = 'game:rowChosen',
  GAME_NEED_ROW_CHOICE = 'game:needRowChoice',
  GAME_TURN_FINISHED = 'game:turnFinished',
  GAME_ROUND_FINISHED = 'game:roundFinished',
  GAME_ENDED = 'game:ended',

  // Chat -> Server
  CHAT_SEND = 'chat:send',
  CHAT_MARK_READ = 'chat:markRead',
  CHAT_GET_HISTORY = 'chat:getHistory',
  CHAT_EDIT = 'chat:edit',
  CHAT_DELETE = 'chat:delete',

  // Chat -> Client
  CHAT_NEW_MESSAGE = 'chat:newMessage',
  CHAT_MESSAGE_ERROR = 'chat:messageError',
  CHAT_MESSAGE_READ = 'chat:messageRead',
  CHAT_HISTORY = 'chat:history',
  CHAT_MESSAGE_EDITED = 'chat:messageEdited',
  CHAT_MESSAGE_DELETED = 'chat:messageDeleted',

  // Event -> Client
  NOTIFICATION_NEW = 'notification:new',
  NOTIFICATION_READ = 'notification:read',
  NOTIFICATION_ALL_READ = 'notification:allRead',

  // System
  ERROR = 'error',
}
