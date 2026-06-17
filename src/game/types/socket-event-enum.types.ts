export const enum SocketEvent {
  // Room events
  SUBSCRIBE_ROOM = 'subscribeRoom',
  PLAYER_SUBSCRIBED = 'playerSubscribed',
  JOIN_ROOM = 'joinRoom',
  PLAYER_JOINED = 'playerJoined',
  PLAYER_JOINED_ERROR = 'playerJoinedError',
  EXIT_ROOM = 'exitRoom',

  PLAYER_LEAVE = 'playerLeave',
  PLAYER_LEAVE_ERROR = 'playerLeaveError',

  // Game lifecycle
  START_GAME = 'startGame',
  GAME_STARTED = 'gameStarted',
  GAME_STATE_CHANGED = 'gameStateChanged',
  GET_GAME_STATE = 'getGameState',

  // Card actions
  SELECT_CARD = 'selectCard',
  CARD_SELECTED = 'cardSelected',
  CONFIRM_CARD = 'confirmCard',
  DECLINE_CARD = 'declineCard',
  CARD_CONFIRMED = 'cardConfirmed',
  CARDS_REVEALED = 'cardsRevealed',
  CARD_DECLINED = 'cardDeclined',

  // Turn/Round
  CHOOSE_ROW = 'chooseRow',
  ROW_CHOSEN = 'rowChosen',
  NEED_ROW_CHOICE = 'needRowChoice',
  TURN_FINISHED = 'turnFinished',
  ROUND_FINISHED = 'roundFinished',
  // Game end
  GAME_ENDED = 'gameEnded',

  // Player state
  READY = 'ready',

  PLAYER_READY = 'playerReady',
  PLAYER_READY_ERROR = 'playerReadyError',

  // Chat
  SEND_MESSAGE = 'sendMessage',
  NEW_MESSAGE = 'newMessage',
  MESSAGE_ERROR = 'messageError',
  MARK_READ = 'markRead',
  MESSAGE_READ = 'messageRead',
  GET_CHAT_HISTORY = 'getChatHistory',
  CHAT_HISTORY = 'chatHistory',

  // Errors
  ERROR = 'error',
}
