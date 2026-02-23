export const enum SocketEvent {
  // Room events
  SUBSCRIBE_ROOM = 'subscribeRoom',
  PLAYER_SUBSCRIBED = 'playerSubscribed',
  JOIN_ROOM = 'joinRoom',
  PLAYER_JOINED = 'playerJoined',
  EXIT_ROOM = 'exitRoom',
  PLAYER_LEAVE = 'playerLeave',

  // Game lifecycle
  START_GAME = 'startGame',
  GAME_STARTED = 'gameStarted',
  GAME_STATE_CHANGED = 'gameStateChanged',
  GET_GAME_STATE = 'getGameState',

  // Card actions
  SELECT_CARD = 'selectCard',
  CARD_SELECTED = 'cardSelected',
  CONFIRM_CARD = 'confirmCard',
  CARD_CONFIRMED = 'cardConfirmed',
  CARDS_REVEALED = 'cardsRevealed',

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

  // Errors
  ERROR = 'error',
}
