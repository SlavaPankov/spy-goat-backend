import { GameGateway } from './game.gateway';
import { GameService, GameState, RoundFinishedData, StepCallback } from '../../game/game.service';
import { RoomService } from '../../room/room.service';
import { SocketServerService } from '../socket-server.service';
import { SocketEvent } from '../types/socket-event-enum.types';
import { EErrorMessages } from '../../types/enums/errorMessage';
import { Socket } from 'socket.io';

jest.mock('../../utils/sleep', () => ({
  sleep: jest.fn().mockResolvedValue(undefined),
}));

type GameServiceMock = {
  selectCard: jest.Mock;
  confirmCardChoice: jest.Mock;
  declineCardChoice: jest.Mock;
  chooseRow: jest.Mock;
  getGameState: jest.Mock;
  revealCards: jest.Mock;
  startTurnProcessing: jest.Mock;
};
type RoomServiceMock = { findPlayerByUserId: jest.Mock };
type SocketServerServiceMock = { emitToRoom: jest.Mock; emitError: jest.Mock };

type GameGatewayInternals = { scheduledTurnProcessing: Set<string> };
type GameGatewayPrivates = {
  emitTurnResult: (
    roomId: string,
    result: GameState & { isRoundFinished?: boolean; isGameEnded?: boolean; roundData?: RoundFinishedData },
    eventId?: string
  ) => void;
};

const getInternals = (g: GameGateway) => g as unknown as GameGatewayInternals;
const getPrivates = (g: GameGateway) => g as unknown as GameGatewayPrivates;

const GAME_ID = 'game-1';
const ROOM_ID = 'ROOM_ID';
const PLAYER_ID = 'PLAYER_ID';

const buildClient = (data: Record<string, unknown> = {}) =>
  ({ emit: jest.fn(), data }) as unknown as Socket & { emit: jest.Mock };

describe('GameGateway', () => {
  let gateway: GameGateway;
  let gameService: GameServiceMock;
  let roomService: RoomServiceMock;
  let socketServer: SocketServerServiceMock;

  beforeEach(() => {
    gameService = {
      selectCard: jest.fn(),
      confirmCardChoice: jest.fn(),
      declineCardChoice: jest.fn(),
      chooseRow: jest.fn(),
      getGameState: jest.fn(),
      revealCards: jest.fn(),
      startTurnProcessing: jest.fn(),
    };
    roomService = { findPlayerByUserId: jest.fn() };
    socketServer = { emitToRoom: jest.fn(), emitError: jest.fn() };

    gateway = new GameGateway(
      gameService as unknown as GameService,
      roomService as unknown as RoomService,
      socketServer as unknown as SocketServerService
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('handleSelectCard', () => {
    it('selects the card and acks the caller with the fresh state', async () => {
      const client = buildClient({ userId: 'user-1' });
      gameService.selectCard.mockResolvedValue(undefined);
      gameService.getGameState.mockResolvedValue({ gameId: GAME_ID });
      roomService.findPlayerByUserId.mockResolvedValue({ id: PLAYER_ID });

      await gateway.handleSelectCard(client, {
        gameId: GAME_ID,
        roomId: ROOM_ID,
        playerId: PLAYER_ID,
        card: { number: 5, penalty: 1 },
        eventId: 'event-1',
      });

      expect(gameService.selectCard).toHaveBeenCalledWith(PLAYER_ID, { number: 5, penalty: 1 });
      expect(roomService.findPlayerByUserId).toHaveBeenCalledWith(ROOM_ID, 'user-1');
      expect(client.emit).toHaveBeenCalledWith(
        SocketEvent.GAME_CARD_SELECTED,
        expect.objectContaining({
          message: {
            card: { number: 5, penalty: 1 },
            gameState: { gameId: GAME_ID },
            currentPlayer: { id: PLAYER_ID },
          },
          eventId: 'event-1',
        })
      );
    });

    it('emits an error when selecting the card fails', async () => {
      const client = buildClient();
      const error = new Error('not in hand');
      gameService.selectCard.mockRejectedValue(error);

      await gateway.handleSelectCard(client, {
        gameId: GAME_ID,
        roomId: ROOM_ID,
        playerId: PLAYER_ID,
        card: { number: 5, penalty: 1 },
      });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.GAME_CARD_SELECTED, error, {});
    });

    it('includes the eventId in the error payload when one was provided', async () => {
      const client = buildClient();
      const error = new Error('not in hand');
      gameService.selectCard.mockRejectedValue(error);

      await gateway.handleSelectCard(client, {
        gameId: GAME_ID,
        roomId: ROOM_ID,
        playerId: PLAYER_ID,
        card: { number: 5, penalty: 1 },
        eventId: 'event-1',
      });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.GAME_CARD_SELECTED, error, {
        eventId: 'event-1',
      });
    });
  });

  describe('handleConfirmCard', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('broadcasts the confirmation without scheduling turn processing when not everyone is ready', async () => {
      const client = buildClient();
      gameService.confirmCardChoice.mockResolvedValue({ allReady: false, gameId: GAME_ID });
      gameService.getGameState.mockResolvedValue({ gameId: GAME_ID });
      roomService.findPlayerByUserId.mockResolvedValue({ id: PLAYER_ID, selectedCard: { number: 5, penalty: 1 } });

      await gateway.handleConfirmCard(client, { gameId: GAME_ID, roomId: ROOM_ID, playerId: PLAYER_ID });

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_CARD_CONFIRMED,
        {
          card: { number: 5, penalty: 1 },
          currentPlayer: { id: PLAYER_ID, selectedCard: { number: 5, penalty: 1 } },
          gameState: { gameId: GAME_ID },
        },
        undefined
      );
      expect(gameService.revealCards).not.toHaveBeenCalled();
    });

    it('emits an error and stops when the confirming player cannot be resolved', async () => {
      const client = buildClient();
      gameService.confirmCardChoice.mockResolvedValue({ allReady: false, gameId: GAME_ID });
      gameService.getGameState.mockResolvedValue({ gameId: GAME_ID });
      roomService.findPlayerByUserId.mockResolvedValue(null);

      await gateway.handleConfirmCard(client, { gameId: GAME_ID, roomId: ROOM_ID, playerId: PLAYER_ID });

      expect(socketServer.emitError).toHaveBeenCalledWith(
        client,
        SocketEvent.GAME_CARD_CONFIRMED,
        EErrorMessages.PLAYER_NOT_FOUND
      );
      expect(socketServer.emitToRoom).not.toHaveBeenCalled();
    });

    it('emits a confirm error when confirmCardChoice fails', async () => {
      const client = buildClient();
      const error = new Error('no card selected');
      gameService.confirmCardChoice.mockRejectedValue(error);

      await gateway.handleConfirmCard(client, { gameId: GAME_ID, roomId: ROOM_ID, playerId: PLAYER_ID });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.GAME_CARD_CONFIRMED, error, {});
    });

    it('includes the eventId in the error payload when confirmCardChoice fails', async () => {
      const client = buildClient();
      const error = new Error('no card selected');
      gameService.confirmCardChoice.mockRejectedValue(error);

      await gateway.handleConfirmCard(client, {
        gameId: GAME_ID,
        roomId: ROOM_ID,
        playerId: PLAYER_ID,
        eventId: 'event-1',
      });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.GAME_CARD_CONFIRMED, error, {
        eventId: 'event-1',
      });
    });

    it('reveals cards and, after the pause, asks for a row choice when the next action needs one', async () => {
      const client = buildClient();
      gameService.confirmCardChoice.mockResolvedValue({ allReady: true, gameId: GAME_ID });
      gameService.getGameState.mockResolvedValue({ gameId: GAME_ID });
      roomService.findPlayerByUserId.mockResolvedValue({ id: PLAYER_ID, selectedCard: { number: 5, penalty: 1 } });
      gameService.revealCards.mockResolvedValue([{ playerId: PLAYER_ID, card: { number: 5, penalty: 1 } }]);
      gameService.startTurnProcessing.mockResolvedValue({
        action: { actionType: 'choose_row' },
        currentChoosingPlayer: PLAYER_ID,
      });

      await gateway.handleConfirmCard(client, {
        gameId: GAME_ID,
        roomId: ROOM_ID,
        playerId: PLAYER_ID,
        eventId: 'event-1',
      });

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_CARDS_REVEALED,
        { cards: [{ playerId: PLAYER_ID, card: { number: 5, penalty: 1 } }] },
        'event-1'
      );
      expect(getInternals(gateway).scheduledTurnProcessing.has(GAME_ID)).toBe(true);

      await jest.advanceTimersByTimeAsync(4000);

      expect(gameService.startTurnProcessing).toHaveBeenCalledWith(GAME_ID, expect.any(Function));
      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_NEED_ROW_CHOICE,
        {
          currentChoosingPlayer: PLAYER_ID,
          action: { actionType: 'choose_row' },
          gameState: { action: { actionType: 'choose_row' }, currentChoosingPlayer: PLAYER_ID },
        },
        'event-1'
      );
      expect(getInternals(gateway).scheduledTurnProcessing.has(GAME_ID)).toBe(false);
    });

    it('does not reveal or schedule again while a turn is already scheduled for the game', async () => {
      const client = buildClient();
      gameService.confirmCardChoice.mockResolvedValue({ allReady: true, gameId: GAME_ID });
      gameService.getGameState.mockResolvedValue({ gameId: GAME_ID });
      roomService.findPlayerByUserId.mockResolvedValue({ id: PLAYER_ID, selectedCard: { number: 5, penalty: 1 } });
      getInternals(gateway).scheduledTurnProcessing.add(GAME_ID);

      await gateway.handleConfirmCard(client, { gameId: GAME_ID, roomId: ROOM_ID, playerId: PLAYER_ID });

      expect(gameService.revealCards).not.toHaveBeenCalled();
    });

    it('broadcasts the turn result directly when no row choice is needed', async () => {
      const client = buildClient();
      gameService.confirmCardChoice.mockResolvedValue({ allReady: true, gameId: GAME_ID });
      gameService.getGameState.mockResolvedValue({ gameId: GAME_ID });
      roomService.findPlayerByUserId.mockResolvedValue({ id: PLAYER_ID, selectedCard: { number: 5, penalty: 1 } });
      gameService.revealCards.mockResolvedValue([]);
      gameService.startTurnProcessing.mockResolvedValue({ action: { actionType: 'place' }, gameId: GAME_ID });

      await gateway.handleConfirmCard(client, {
        gameId: GAME_ID,
        roomId: ROOM_ID,
        playerId: PLAYER_ID,
        eventId: 'event-1',
      });
      await jest.advanceTimersByTimeAsync(4000);

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_TURN_FINISHED,
        { gameState: { action: { actionType: 'place' }, gameId: GAME_ID } },
        'event-1'
      );
    });

    it('relays row-chosen and applied steps through onStep while the turn is processing', async () => {
      const client = buildClient();
      gameService.confirmCardChoice.mockResolvedValue({ allReady: true, gameId: GAME_ID });
      gameService.getGameState.mockResolvedValue({ gameId: GAME_ID });
      roomService.findPlayerByUserId.mockResolvedValue({ id: PLAYER_ID, selectedCard: { number: 5, penalty: 1 } });
      gameService.revealCards.mockResolvedValue([]);
      gameService.startTurnProcessing.mockImplementation(async (_gameId: string, onStep: StepCallback) => {
        await onStep({
          gameState: { step: 1 } as unknown as GameState,
          action: { playerId: PLAYER_ID, actionType: 'take_row', rowIndex: 0 },
          phase: 'row-chosen',
        });
        await onStep({
          gameState: { step: 2 } as unknown as GameState,
          action: { playerId: PLAYER_ID, actionType: 'take_row', rowIndex: 0 },
          phase: 'applied',
        });
        return { action: { actionType: 'place' }, gameId: GAME_ID };
      });

      await gateway.handleConfirmCard(client, {
        gameId: GAME_ID,
        roomId: ROOM_ID,
        playerId: PLAYER_ID,
        eventId: 'event-1',
      });
      await jest.advanceTimersByTimeAsync(4000);

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_ROW_CHOSEN,
        { playerId: PLAYER_ID, rowIndex: 0 },
        'event-1'
      );
      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_TURN_FINISHED,
        { gameState: { step: 2 } },
        'event-1'
      );
    });

    it('emits a generic error and clears the schedule lock when turn processing fails', async () => {
      const client = buildClient();
      gameService.confirmCardChoice.mockResolvedValue({ allReady: true, gameId: GAME_ID });
      gameService.getGameState.mockResolvedValue({ gameId: GAME_ID });
      roomService.findPlayerByUserId.mockResolvedValue({ id: PLAYER_ID, selectedCard: { number: 5, penalty: 1 } });
      gameService.revealCards.mockResolvedValue([]);
      const error = new Error('turn processing exploded');
      gameService.startTurnProcessing.mockRejectedValue(error);

      await gateway.handleConfirmCard(client, {
        gameId: GAME_ID,
        roomId: ROOM_ID,
        playerId: PLAYER_ID,
        eventId: 'event-1',
      });
      await jest.advanceTimersByTimeAsync(4000);

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.ERROR, error, { eventId: 'event-1' });
      expect(getInternals(gateway).scheduledTurnProcessing.has(GAME_ID)).toBe(false);
    });
  });

  describe('handleDeclineCard', () => {
    it('broadcasts the decline with the fresh state', async () => {
      const client = buildClient({ userId: 'user-1' });
      gameService.declineCardChoice.mockResolvedValue({ gameId: GAME_ID });
      gameService.getGameState.mockResolvedValue({ gameId: GAME_ID });
      roomService.findPlayerByUserId.mockResolvedValue({ id: PLAYER_ID });

      await gateway.handleDeclineCard(client, {
        gameId: GAME_ID,
        roomId: ROOM_ID,
        playerId: PLAYER_ID,
        eventId: 'event-1',
      });

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_CARD_DECLINED,
        { playerId: PLAYER_ID, gameState: { gameId: GAME_ID }, currentPlayer: { id: PLAYER_ID } },
        'event-1'
      );
    });

    it('emits an error when the confirming player cannot be resolved', async () => {
      const client = buildClient();
      gameService.declineCardChoice.mockResolvedValue({ gameId: GAME_ID });
      gameService.getGameState.mockResolvedValue({ gameId: GAME_ID });
      roomService.findPlayerByUserId.mockResolvedValue(null);

      await gateway.handleDeclineCard(client, { gameId: GAME_ID, roomId: ROOM_ID, playerId: PLAYER_ID });

      expect(socketServer.emitError).toHaveBeenCalledWith(
        client,
        SocketEvent.GAME_CARD_DECLINED,
        EErrorMessages.PLAYER_NOT_FOUND,
        {}
      );
    });

    it('includes the eventId when the confirming player cannot be resolved', async () => {
      const client = buildClient();
      gameService.declineCardChoice.mockResolvedValue({ gameId: GAME_ID });
      gameService.getGameState.mockResolvedValue({ gameId: GAME_ID });
      roomService.findPlayerByUserId.mockResolvedValue(null);

      await gateway.handleDeclineCard(client, {
        gameId: GAME_ID,
        roomId: ROOM_ID,
        playerId: PLAYER_ID,
        eventId: 'event-1',
      });

      expect(socketServer.emitError).toHaveBeenCalledWith(
        client,
        SocketEvent.GAME_CARD_DECLINED,
        EErrorMessages.PLAYER_NOT_FOUND,
        { eventId: 'event-1' }
      );
    });

    it('emits a decline error when declineCardChoice fails', async () => {
      const client = buildClient();
      const error = new Error('not confirmed yet');
      gameService.declineCardChoice.mockRejectedValue(error);

      await gateway.handleDeclineCard(client, { gameId: GAME_ID, roomId: ROOM_ID, playerId: PLAYER_ID });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.GAME_CARD_DECLINED, error, {});
    });

    it('includes the eventId in the error payload when declineCardChoice fails', async () => {
      const client = buildClient();
      const error = new Error('not confirmed yet');
      gameService.declineCardChoice.mockRejectedValue(error);

      await gateway.handleDeclineCard(client, {
        gameId: GAME_ID,
        roomId: ROOM_ID,
        playerId: PLAYER_ID,
        eventId: 'event-1',
      });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.GAME_CARD_DECLINED, error, {
        eventId: 'event-1',
      });
    });
  });

  describe('handleChooseRow', () => {
    it('asks for another row choice when the next player also needs one', async () => {
      const client = buildClient();
      gameService.getGameState.mockResolvedValue({ roomId: ROOM_ID });
      gameService.chooseRow.mockResolvedValue({
        action: { actionType: 'choose_row' },
        currentChoosingPlayer: 'next-player',
      });

      await gateway.handleChooseRow(client, { gameId: GAME_ID, playerId: PLAYER_ID, rowIndex: 0, eventId: 'event-1' });

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_ROW_CHOSEN,
        { playerId: PLAYER_ID, rowIndex: 0 },
        'event-1'
      );
      expect(gameService.chooseRow).toHaveBeenCalledWith(GAME_ID, PLAYER_ID, 0, expect.any(Function));
      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_NEED_ROW_CHOICE,
        {
          currentChoosingPlayer: 'next-player',
          action: { actionType: 'choose_row' },
          gameState: { action: { actionType: 'choose_row' }, currentChoosingPlayer: 'next-player' },
        },
        'event-1'
      );
    });

    it('broadcasts the turn result when the row choice finishes the turn', async () => {
      const client = buildClient();
      gameService.getGameState.mockResolvedValue({ roomId: ROOM_ID });
      gameService.chooseRow.mockResolvedValue({ action: { actionType: 'place' }, gameId: GAME_ID });

      await gateway.handleChooseRow(client, { gameId: GAME_ID, playerId: PLAYER_ID, rowIndex: 0, eventId: 'event-1' });

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_TURN_FINISHED,
        { gameState: { action: { actionType: 'place' }, gameId: GAME_ID } },
        'event-1'
      );
    });

    it('emits a choose-row error when it fails', async () => {
      const client = buildClient();
      const error = new Error('not your turn');
      gameService.getGameState.mockRejectedValue(error);

      await gateway.handleChooseRow(client, { gameId: GAME_ID, playerId: PLAYER_ID, rowIndex: 0 });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.GAME_CHOOSE_ROW, error, {});
    });

    it('includes the eventId in the error payload when it fails', async () => {
      const client = buildClient();
      const error = new Error('not your turn');
      gameService.getGameState.mockRejectedValue(error);

      await gateway.handleChooseRow(client, { gameId: GAME_ID, playerId: PLAYER_ID, rowIndex: 0, eventId: 'event-1' });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.GAME_CHOOSE_ROW, error, {
        eventId: 'event-1',
      });
    });

    it('relays the row-chosen step through onStep while chooseRow is processing', async () => {
      const client = buildClient();
      gameService.getGameState.mockResolvedValue({ roomId: ROOM_ID });
      gameService.chooseRow.mockImplementation(
        async (_gameId: string, _playerId: string, _rowIndex: number, onStep: StepCallback) => {
          await onStep({
            gameState: { step: 1 } as unknown as GameState,
            action: { playerId: PLAYER_ID, actionType: 'take_row', rowIndex: 1 },
            phase: 'row-chosen',
          });
          await onStep({
            gameState: { step: 2 } as unknown as GameState,
            action: { playerId: PLAYER_ID, actionType: 'take_row', rowIndex: 1 },
            phase: 'applied',
          });
          return { action: { actionType: 'place' }, gameId: GAME_ID };
        }
      );

      await gateway.handleChooseRow(client, { gameId: GAME_ID, playerId: PLAYER_ID, rowIndex: 1, eventId: 'event-1' });

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_ROW_CHOSEN,
        { playerId: PLAYER_ID, rowIndex: 1 },
        'event-1'
      );
      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_TURN_FINISHED,
        { gameState: { step: 2 } },
        'event-1'
      );
    });
  });

  describe('handleGetState', () => {
    it('broadcasts the current game state to its room', async () => {
      const client = buildClient();
      gameService.getGameState.mockResolvedValue({ roomId: ROOM_ID, gameId: GAME_ID });

      await gateway.handleGetState(client, { gameId: GAME_ID, eventId: 'event-1' });

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_STATE_CHANGED,
        { gameState: { roomId: ROOM_ID, gameId: GAME_ID } },
        'event-1'
      );
    });

    it('emits a state error when the game cannot be found', async () => {
      const client = buildClient();
      const error = new Error('game not found');
      gameService.getGameState.mockRejectedValue(error);

      await gateway.handleGetState(client, { gameId: GAME_ID });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.GAME_STATE_CHANGED, error, {});
    });

    it('includes the eventId in the error payload when it fails', async () => {
      const client = buildClient();
      const error = new Error('game not found');
      gameService.getGameState.mockRejectedValue(error);

      await gateway.handleGetState(client, { gameId: GAME_ID, eventId: 'event-1' });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.GAME_STATE_CHANGED, error, {
        eventId: 'event-1',
      });
    });
  });

  describe('emitTurnResult (private)', () => {
    it('emits GAME_ENDED when the game has ended', () => {
      const result = { isGameEnded: true } as unknown as GameState & { isGameEnded?: boolean };

      getPrivates(gateway).emitTurnResult(ROOM_ID, result, 'event-1');

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_ENDED,
        { gameState: result },
        'event-1'
      );
    });

    it('emits GAME_ROUND_FINISHED when the round finished with round data', () => {
      const roundData = { roundNumber: 2 } as unknown as RoundFinishedData;
      const result = { isRoundFinished: true, roundData } as unknown as GameState & {
        isRoundFinished?: boolean;
        roundData?: RoundFinishedData;
      };

      getPrivates(gateway).emitTurnResult(ROOM_ID, result, 'event-1');

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_ROUND_FINISHED,
        roundData,
        'event-1'
      );
    });

    it('falls back to GAME_TURN_FINISHED otherwise', () => {
      const result = {} as unknown as GameState;

      getPrivates(gateway).emitTurnResult(ROOM_ID, result, 'event-1');

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_TURN_FINISHED,
        { gameState: result },
        'event-1'
      );
    });
  });
});
