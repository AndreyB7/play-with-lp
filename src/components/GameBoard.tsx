import React, { FC, useEffect, useMemo } from 'react';
import { Socket } from 'socket.io';
import RoundInfo from '../components/RoundInfo';
import GameDeck from '../components/GameDeck';
import ScoreInfo from "./ScoreInfo";
import PlayersInfo from "./PlayersInfo";
import Dictionary from "./Dictionary";

interface Props {
  game: Game,
  socketGame: Socket;
  player: Player;
}

const GameBoard: FC<Props> = ({ game, socketGame, player }) => {

  const handleClickNextRound = () => {
    socketGame.emit('game-next-round', player);
  }

  const onEndTurn = (e) => {
    e.target.disabled = true; // prevent double click
    socketGame.emit('game-end-turn');
  }
  const onHasWord = (e) => {
    e.target.disabled = true; // prevent double click
    socketGame.emit('game-has-word', player.uid);
  }

  const isAllReady = useMemo(() => game.allPlayersReadyToGame, [game]);

  const isRoundStarted = useMemo(() => {
    return game.rounds.length > 0;
  }, [game.rounds]);

  const isRoundEnd = useMemo(() => {
    return (game.gameStatus === 'endRound' || game.gameStatus === 'finished')
  }, [game.gameStatus]);

  const isMyTurn = useMemo(() => {
    return game.currentHand === player.uid;
  }, [game, player]);

  const iSaidWord = useMemo(() => {
    return game.playerHasWord === player.uid;
  }, [game, player]);

  const isHandWithRightCardsCount = useMemo(() => {
    if (!game.rounds.length) {
      return true;
    }
    return game.rounds[0].hands[`${ player.uid }`].length === game.rounds.length + 2;
  }, [game]);

  const canIEndTurn = useMemo(() => {
    if (isRoundStarted && isMyTurn && isHandWithRightCardsCount) {
      return !(game.isLastCircle && iSaidWord);
    }

    return false;
  }, [isRoundStarted, isMyTurn, game, iSaidWord]);

  const canISayWord = useMemo(() => {
    if (isRoundStarted && isHandWithRightCardsCount) {
      return !game.playerHasWord && isMyTurn;
    }
    return false;
  }, [isRoundStarted, game]);

  const addExtraScore = (uid: UID) => {
    socketGame.emit('add-extra-score', uid);
  }

  const gameStarted = useMemo(() => game.gameStatus !== 'notStarted', [game]);

  const canIStarNewRound = useMemo(() => {
    switch (game.gameStatus) {
      case 'notStarted':
        return game.allPlayersReadyToGame;
      case 'started':
      case 'endRound':
        return isMyTurn && game.isLastCircle && iSaidWord;
      case 'lastRound':
      case 'finished':
      default:
        return false;
    }
  }, [isMyTurn, game, iSaidWord]);

  useEffect(() => {
    if (game.gameStatus === 'endRound') {
      // todo here we can process end round
    }
    if (game.gameStatus === 'finished') {
      // todo here we can process end game
    }
  }, [game]);

  return (
    <>
      <div className='md:w-9/12'>
        <div className='flex m-1.5 mb-2 button-group'>
          <button className='main' onClick={ handleClickNextRound } disabled={ !canIStarNewRound || !isAllReady }>
            { gameStarted ? 'Next Round' : 'Start Game' }
          </button>
          <button className='main' onClick={ onEndTurn } disabled={ !canIEndTurn }>End Turn</button>
          <button className='main' onClick={ onHasWord } disabled={ !canISayWord }>I has word</button>
        </div>
        {
          game.rounds.length > 0 && (
            <GameDeck game={ game } player={ player } isMyTurn={ isMyTurn } isRoundEnd={isRoundEnd} socket={ socketGame }/>
          )
        }
      </div>
      <div className='md:w-3/12 p-1.5 flex flex-col items-start'>
        { gameStarted && <RoundInfo game={ game }/> }
        <PlayersInfo game={ game } player={player} canIStarNewRound={canIStarNewRound} addExtraScore={addExtraScore}/>
        <ScoreInfo game={ game }/>
        <Dictionary socket={ socketGame }/>
        <button onClick={ () => socketGame.emit('log-state') }
                className='mt-2 mt-auto hidden main' disabled={ false }>Log
        </button>
        <button onClick={ () => socketGame.emit('game-reset') }
                className='mb-2 mw-200 main' disabled={ false }>End / New Game
        </button>
      </div>
    </>
  );
};

export default GameBoard;