import { RoomGateway } from './room.gateway';
import { RoomService } from '../../room/room.service';
import { GameService } from '../../game/game.service';
import { SocketServerService } from '../socket-server.service';
import { SocketEvent } from '../types/socket-event-enum.types';
import { Socket } from 'socket.io';

type RoomServiceMock = {
  join: jest.Mock;
  notifyPlayerJoined: jest.Mock;
  findPlayerByUserId: jest.Mock;
  exit: jest.Mock;
  findOneDetails: jest.Mock;
  findRoomPlayers: jest.Mock;
  findRoomStats: jest.Mock;
  findPlayerById: jest.Mock;
};
type GameServiceMock = { getGameState: jest.Mock; setIsReady: jest.Mock; startGame: jest.Mock };
type SocketServerServiceMock = { emitToRoom: jest.Mock; emitError: jest.Mock };

const ROOM_ID = 'ROOM_ID';
const USER_ID = 'USER_ID';
const PLAYER_ID = 'PLAYER_ID';

const buildClient = () =>
  ({
    join: jest.fn(),
    emit: jest.fn(),
    data: {} as Record<string, unknown>,
  }) as unknown as Socket & { join: jest.Mock; emit: jest.Mock; data: Record<string, unknown> };

describe('RoomGateway', () => {
  let gateway: RoomGateway;
  let roomService: RoomServiceMock;
  let gameService: GameServiceMock;
  let socketServer: SocketServerServiceMock;

  beforeEach(() => {
    roomService = {
      join: jest.fn(),
      notifyPlayerJoined: jest.fn(),
      findPlayerByUserId: jest.fn(),
      exit: jest.fn(),
      findOneDetails: jest.fn(),
      findRoomPlayers: jest.fn(),
      findRoomStats: jest.fn(),
      findPlayerById: jest.fn(),
    };
    gameService = { getGameState: jest.fn(), setIsReady: jest.fn(), startGame: jest.fn() };
    socketServer = { emitToRoom: jest.fn(), emitError: jest.fn() };

    gateway = new RoomGateway(
      roomService as unknown as RoomService,
      gameService as unknown as GameService,
      socketServer as unknown as SocketServerService
    );
  });

  describe('handleSubscribe', () => {
    it('joins the socket to the room and acks the caller', async () => {
      const client = buildClient();

      await gateway.handleSubscribe(client, { roomId: ROOM_ID, eventId: 'event-1' });

      expect(client.join).toHaveBeenCalledWith(ROOM_ID);
      expect(client.data.roomId).toBe(ROOM_ID);
      expect(client.emit).toHaveBeenCalledWith(
        SocketEvent.ROOM_SUBSCRIBED,
        expect.objectContaining({ success: true, message: { roomId: ROOM_ID }, eventId: 'event-1' })
      );
      expect(gameService.getGameState).not.toHaveBeenCalled();
    });

    it('also broadcasts the game state when a gameId is provided', async () => {
      const client = buildClient();
      gameService.getGameState.mockResolvedValue({ gameId: 'game-1' });

      await gateway.handleSubscribe(client, { roomId: ROOM_ID, gameId: 'game-1', eventId: 'event-1' });

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_STATE_CHANGED,
        { gameState: { gameId: 'game-1' } },
        'event-1'
      );
    });

    it('emits an error when the game state cannot be fetched', async () => {
      const client = buildClient();
      const error = new Error('not found');
      gameService.getGameState.mockRejectedValue(error);

      await gateway.handleSubscribe(client, { roomId: ROOM_ID, gameId: 'game-1' });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.ROOM_SUBSCRIBED, error, {});
    });

    it('includes the eventId in the error payload when one was provided', async () => {
      const client = buildClient();
      const error = new Error('not found');
      gameService.getGameState.mockRejectedValue(error);

      await gateway.handleSubscribe(client, { roomId: ROOM_ID, gameId: 'game-1', eventId: 'event-1' });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.ROOM_SUBSCRIBED, error, {
        eventId: 'event-1',
      });
    });
  });

  describe('handleJoin', () => {
    it('joins the room, notifies it, and acks the caller with their player', async () => {
      const client = buildClient();
      roomService.join.mockResolvedValue({});
      roomService.notifyPlayerJoined.mockResolvedValue(undefined);
      roomService.findPlayerByUserId.mockResolvedValue({ id: PLAYER_ID });

      await gateway.handleJoin(client, { roomId: ROOM_ID, userId: USER_ID, eventId: 'event-1' });

      expect(roomService.join).toHaveBeenCalledWith(ROOM_ID, USER_ID);
      expect(roomService.notifyPlayerJoined).toHaveBeenCalledWith(ROOM_ID, 'event-1');
      expect(client.emit).toHaveBeenCalledWith(
        SocketEvent.ROOM_PLAYER_UPDATED,
        expect.objectContaining({ success: true, message: { currentPlayer: { id: PLAYER_ID } }, eventId: 'event-1' })
      );
    });

    it('emits a join error when joining fails', async () => {
      const client = buildClient();
      const error = new Error('room is full');
      roomService.join.mockRejectedValue(error);

      await gateway.handleJoin(client, { roomId: ROOM_ID, userId: USER_ID });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.ROOM_PLAYER_JOINED_ERROR, error, {});
    });

    it('includes the eventId in the error payload when one was provided', async () => {
      const client = buildClient();
      const error = new Error('room is full');
      roomService.join.mockRejectedValue(error);

      await gateway.handleJoin(client, { roomId: ROOM_ID, userId: USER_ID, eventId: 'event-1' });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.ROOM_PLAYER_JOINED_ERROR, error, {
        eventId: 'event-1',
      });
    });
  });

  describe('handleExit', () => {
    it('broadcasts updated room state and stats when other players remain', async () => {
      const client = buildClient();
      roomService.exit.mockResolvedValue({ success: true });
      roomService.findOneDetails.mockResolvedValue({ id: ROOM_ID });
      roomService.findRoomPlayers.mockResolvedValue({ players: [] });
      roomService.findRoomStats.mockResolvedValue([]);

      await gateway.handleExit(client, { roomId: ROOM_ID, userId: USER_ID, eventId: 'event-1' });

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.ROOM_PLAYER_LEAVE,
        { roomDetails: { id: ROOM_ID }, roomPlayers: { players: [] } },
        'event-1'
      );
      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.ROOM_STATS_UPDATED,
        { roomStats: [] },
        'event-1'
      );
      expect(client.emit).toHaveBeenCalledWith(
        SocketEvent.ROOM_YOU_LEAVE,
        expect.objectContaining({ success: true, message: {}, eventId: 'event-1' })
      );
    });

    it('skips the room broadcasts when the room was deleted (last player left)', async () => {
      const client = buildClient();
      roomService.exit.mockResolvedValue({ deleted: true });

      await gateway.handleExit(client, { roomId: ROOM_ID, userId: USER_ID });

      expect(roomService.findOneDetails).not.toHaveBeenCalled();
      expect(socketServer.emitToRoom).not.toHaveBeenCalled();
      expect(client.emit).toHaveBeenCalledWith(SocketEvent.ROOM_YOU_LEAVE, expect.objectContaining({ success: true }));
    });

    it('emits an exit error when leaving fails', async () => {
      const client = buildClient();
      const error = new Error('not in room');
      roomService.exit.mockRejectedValue(error);

      await gateway.handleExit(client, { roomId: ROOM_ID, userId: USER_ID });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.ROOM_PLAYER_LEAVE_ERROR, error, {});
    });

    it('includes the eventId in the error payload when one was provided', async () => {
      const client = buildClient();
      const error = new Error('not in room');
      roomService.exit.mockRejectedValue(error);

      await gateway.handleExit(client, { roomId: ROOM_ID, userId: USER_ID, eventId: 'event-1' });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.ROOM_PLAYER_LEAVE_ERROR, error, {
        eventId: 'event-1',
      });
    });
  });

  describe('handleReady', () => {
    it('sets readiness, broadcasts the updated room, and acks the caller', async () => {
      const client = buildClient();
      gameService.setIsReady.mockResolvedValue({});
      roomService.findOneDetails.mockResolvedValue({ id: ROOM_ID });
      roomService.findRoomPlayers.mockResolvedValue({ players: [] });
      roomService.findPlayerById.mockResolvedValue({ id: PLAYER_ID, isReady: true });

      await gateway.handleReady(client, { roomId: ROOM_ID, playerId: PLAYER_ID, isReady: true, eventId: 'event-1' });

      expect(gameService.setIsReady).toHaveBeenCalledWith(PLAYER_ID, ROOM_ID, true);
      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.ROOM_PLAYER_READY,
        { roomDetails: { id: ROOM_ID }, roomPlayers: { players: [] } },
        'event-1'
      );
      expect(client.emit).toHaveBeenCalledWith(
        SocketEvent.ROOM_PLAYER_UPDATED,
        expect.objectContaining({ message: { currentPlayer: { id: PLAYER_ID, isReady: true } } })
      );
    });

    it('emits a ready error when updating readiness fails', async () => {
      const client = buildClient();
      const error = new Error('player not found');
      gameService.setIsReady.mockRejectedValue(error);

      await gateway.handleReady(client, { roomId: ROOM_ID, playerId: PLAYER_ID, isReady: true });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.ROOM_PLAYER_READY_ERROR, error, {});
    });

    it('includes the eventId in the error payload when one was provided', async () => {
      const client = buildClient();
      const error = new Error('player not found');
      gameService.setIsReady.mockRejectedValue(error);

      await gateway.handleReady(client, {
        roomId: ROOM_ID,
        playerId: PLAYER_ID,
        isReady: true,
        eventId: 'event-1',
      });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.ROOM_PLAYER_READY_ERROR, error, {
        eventId: 'event-1',
      });
    });
  });

  describe('handleStartGame', () => {
    it('starts the game and broadcasts the initial state', async () => {
      const client = buildClient();
      gameService.startGame.mockResolvedValue({ gameId: 'game-1' });

      await gateway.handleStartGame(client, { roomId: ROOM_ID, eventId: 'event-1' });

      expect(gameService.startGame).toHaveBeenCalledWith(ROOM_ID);
      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.GAME_STARTED,
        { gameId: 'game-1' },
        'event-1'
      );
    });

    it('emits a start error when the game cannot start', async () => {
      const client = buildClient();
      const error = new Error('not enough players');
      gameService.startGame.mockRejectedValue(error);

      await gateway.handleStartGame(client, { roomId: ROOM_ID });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.GAME_STARTED_ERROR, error, {});
    });

    it('includes the eventId in the error payload when one was provided', async () => {
      const client = buildClient();
      const error = new Error('not enough players');
      gameService.startGame.mockRejectedValue(error);

      await gateway.handleStartGame(client, { roomId: ROOM_ID, eventId: 'event-1' });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.GAME_STARTED_ERROR, error, {
        eventId: 'event-1',
      });
    });
  });

  describe('handleGetRoomState', () => {
    it('broadcasts the current room details and players', async () => {
      const client = buildClient();
      roomService.findOneDetails.mockResolvedValue({ id: ROOM_ID });
      roomService.findRoomPlayers.mockResolvedValue({ players: [] });

      await gateway.handleGetRoomState(client, { roomId: ROOM_ID, eventId: 'event-1' });

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.ROOM_STATE_CHANGED,
        { roomDetails: { id: ROOM_ID }, roomPlayers: { players: [] } },
        'event-1'
      );
    });

    it('emits a state error when the room cannot be fetched', async () => {
      const client = buildClient();
      const error = new Error('room not found');
      roomService.findOneDetails.mockRejectedValue(error);

      await gateway.handleGetRoomState(client, { roomId: ROOM_ID });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.ROOM_STATE_CHANGED_ERROR, error, {});
    });

    it('includes the eventId in the error payload when one was provided', async () => {
      const client = buildClient();
      const error = new Error('room not found');
      roomService.findOneDetails.mockRejectedValue(error);

      await gateway.handleGetRoomState(client, { roomId: ROOM_ID, eventId: 'event-1' });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.ROOM_STATE_CHANGED_ERROR, error, {
        eventId: 'event-1',
      });
    });
  });
});
