import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
  Query,
  Param,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GameService } from './game.service';
import { JwtGuard } from 'src/auth/guard';
import { GetPlayer } from 'src/auth/decorator';
import { Player as PlayerDB } from '@prisma/client';
import { GameType, Player } from './interfaces';

@UseGuards(JwtGuard)
@Controller('game')
export class GameController {
  constructor(
    private gameService: GameService,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(GameController.name, { timestamp: true });
  }

  @Get('join')
  joinGame(
    @GetPlayer() player: PlayerDB,
    @Res() res: Response,
    @Query('gametype') gametype: GameType,
  ) {
    const id = this.gameService.joinGame(
      new Player(player.id, player.nickname, player.avatar),
      gametype,
    );
    return res.status(200).json(id);
  }

  @Get('invite')
  gameInvite(
    @GetPlayer() player: PlayerDB,
    @Res() res: Response,
    @Query() invite: any,
  ) {
    console.log(invite);
    const gameId = this.gameService.inviteGame(
      new Player(player.id, player.nickname, player.avatar),
      new Player(Number(invite.user.id), invite.user.nickname, invite.user.avatar),
      invite.gameType,
    );
    return res.status(200).json(gameId);
  }

  @Get(':id')
  getGame(
    @GetPlayer('nickname') player: string,
    @Param('id') gameId: string,
    @Res() res: Response,
  ) {
    if (this.gameService.getActiveGame(gameId)) {
      return res.status(200).json('0ki');
    } else if (this.gameService.getMyGame(gameId, player)) {
      return res.status(200).json('0ki');
    }
    return res.status(400).json('N0 game :P');
  }
}
