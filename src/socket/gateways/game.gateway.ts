import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RoomsService } from '../../rooms/rooms.service';
import { SocketServerService } from '../socket-server.service';
import { SocketEvent } from '../types/socket-event-enum.types';
import { SocketResponseBuilder } from '../types/socket-response.types';
import { EErrorMessages } from '../../types/enums/errorMessage';
import { Card, GameService, GameState, RoundFinishedData } from '../../game/game.service';
import { WsJwtGuard } from '../guards/ws-jwt.guard';

@WebSocketGateway(8082, { cors: true })
export class GameGateway {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly gameService: GameService,
    private readonly roomService: RoomsService,
    private readonly socketServer: SocketServerService
  ) {}

  private emitTurnResult(
    roomId: string,
    result: GameState & { isRoundFinished?: boolean; isGameEnded?: boolean; roundData?: RoundFinishedData },
    eventId?: string
  ): void {
    if (result.isGameEnded) {
      this.socketServer.emitToRoom(roomId, SocketEvent.GAME_ENDED, { gameState: result }, eventId);
      return;
    }

    if (result.isRoundFinished && result.roundData) {
      this.socketServer.emitToRoom(roomId, SocketEvent.GAME_ROUND_FINISHED, result.roundData, eventId);
      return;
    }

    this.socketServer.emitToRoom(roomId, SocketEvent.GAME_TURN_FINISHED, { gameState: result }, eventId);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvent.GAME_SELECT_CARD)
  async handleSelectCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; roomId: string; playerId: string; card: Card; eventId?: string }
  ) {
    try {
      await this.gameService.selectCard(data.playerId, data.card);

      const [gameState, currentPlayer] = await Promise.all([
        this.gameService.getGameState(data.gameId),
        this.roomService.findPlayerByUserId(data.roomId, (client.data as Record<string, string>).userId),
      ]);

      client.emit(
        SocketEvent.GAME_CARD_SELECTED,
        SocketResponseBuilder.success({ card: data.card, gameState, currentPlayer }, data.eventId)
      );
    } catch (error) {
      this.socketServer.emitError(client, SocketEvent.GAME_CARD_SELECTED, error, {
        ...(data.eventId && { eventId: data.eventId }),
      });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvent.GAME_CONFIRM_CARD)
  async handleConfirmCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; roomId: string; playerId: string; eventId?: string }
  ) {
    try {
      const result = await this.gameService.confirmCardChoice(data.playerId);

      const [gameState, currentPlayer] = await Promise.all([
        this.gameService.getGameState(data.gameId),
        this.roomService.findPlayerByUserId(data.roomId, (client.data as Record<string, string>).userId),
      ]);

      if (!currentPlayer) {
        this.socketServer.emitError(client, SocketEvent.GAME_CARD_CONFIRMED, EErrorMessages.PLAYER_NOT_FOUND);

        return;
      }

      this.socketServer.emitToRoom(
        data.roomId,
        SocketEvent.GAME_CARD_CONFIRMED,
        {
          card: currentPlayer.selectedCard,
          currentPlayer,
          gameState,
        },
        data.eventId
      );

      if (result.allReady) {
        const revealedCards = await this.gameService.revealCards(result.gameId);

        this.socketServer.emitToRoom(
          data.roomId,
          SocketEvent.GAME_CARDS_REVEALED,
          {
            cards: revealedCards,
          },
          data.eventId
        );

        setTimeout(() => {
          void (async () => {
            try {
              const turnResult = await this.gameService.startTurnProcessing(result.gameId);

              if (turnResult.action.actionType === 'choose_row') {
                this.socketServer.emitToRoom(
                  data.roomId,
                  SocketEvent.GAME_NEED_ROW_CHOICE,
                  {
                    currentChoosingPlayer: turnResult.currentChoosingPlayer,
                    action: turnResult.action,
                    gameState: turnResult,
                  },
                  data.eventId
                );
              } else {
                this.emitTurnResult(data.roomId, turnResult, data.eventId);
              }
            } catch (error) {
              this.socketServer.emitError(client, SocketEvent.ERROR, error, {
                ...(data.eventId && { eventId: data.eventId }),
              });
            }
          })();
        }, 3000);
      }
    } catch (error) {
      this.socketServer.emitError(client, SocketEvent.GAME_CARD_CONFIRMED, error, {
        ...(data.eventId && { eventId: data.eventId }),
      });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvent.GAME_DECLINE_CARD)
  async handleDeclineCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; roomId: string; playerId: string; eventId?: string }
  ) {
    try {
      await this.gameService.declineCardChoice(data.playerId);

      const [gameState, currentPlayer] = await Promise.all([
        this.gameService.getGameState(data.gameId),
        this.roomService.findPlayerByUserId(data.roomId, (client.data as Record<string, string>).userId),
      ]);

      if (!currentPlayer) {
        this.socketServer.emitError(client, SocketEvent.GAME_CARD_DECLINED, EErrorMessages.PLAYER_NOT_FOUND, {
          ...(data.eventId && { eventId: data.eventId }),
        });

        return;
      }

      this.socketServer.emitToRoom(
        data.roomId,
        SocketEvent.GAME_CARD_DECLINED,
        {
          playerId: data.playerId,
          gameState,
          currentPlayer,
        },
        data.eventId
      );
    } catch (error) {
      this.socketServer.emitError(client, SocketEvent.GAME_CARD_DECLINED, error, {
        ...(data.eventId && { eventId: data.eventId }),
      });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvent.GAME_CHOOSE_ROW)
  async handleChooseRow(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; playerId: string; rowIndex: number; eventId?: string }
  ) {
    try {
      const result = await this.gameService.chooseRow(data.gameId, data.playerId, data.rowIndex);

      this.socketServer.emitToRoom(
        result.roomId,
        SocketEvent.GAME_ROW_CHOSEN,
        {
          playerId: data.playerId,
          rowIndex: data.rowIndex,
        },
        data.eventId
      );

      if (result.action?.actionType === 'choose_row') {
        this.socketServer.emitToRoom(
          result.roomId,
          SocketEvent.GAME_NEED_ROW_CHOICE,
          {
            currentChoosingPlayer: result.currentChoosingPlayer,
            action: result.action,
            gameState: result,
          },
          data.eventId
        );
      } else {
        this.emitTurnResult(result.roomId, result, data.eventId);
      }
    } catch (error) {
      this.socketServer.emitError(client, SocketEvent.GAME_CHOOSE_ROW, error, {
        ...(data.eventId && { eventId: data.eventId }),
      });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvent.GAME_GET_STATE)
  async handleGetState(@ConnectedSocket() client: Socket, @MessageBody() data: { gameId: string; eventId?: string }) {
    try {
      const gameState = await this.gameService.getGameState(data.gameId);

      this.socketServer.emitToRoom(gameState.roomId, SocketEvent.GAME_STATE_CHANGED, { gameState }, data.eventId);
    } catch (error) {
      this.socketServer.emitError(client, SocketEvent.GAME_STATE_CHANGED, error, {
        ...(data.eventId && { eventId: data.eventId }),
      });
    }
  }
}
