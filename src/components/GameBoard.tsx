import React, { FC, useEffect, useMemo } from 'react';
import { Socket } from 'socket.io';
import RoundInfo from '../components/RoundInfo';
import GameDeck from '../components/GameDeck';
import CheckIcon from '../components/svg/check.svg'
import MinusIcon from '../components/svg/minus.svg'

interface Props {
  game: Game,
  socketGame: Socket;
  player: Player;
}

const GameBoard: FC<Props> = ({ game, socketGame, player }) => {

  const handleClickStartGame = () => {
    socketGame.emit('game-new', player);
  }
  const handleClickNextRound = () => {
    socketGame.emit('game-next-round');
  }

  const handlePlayerMove = (game: Game) => {
    socketGame.emit('game-move', game);
  }

  const onEndTurn = () => {
    socketGame.emit('game-end-turn');
  }
  const onHasWord = () => {
    socketGame.emit('game-has-word', player.uid);
  }

  const isReadyPlayer = useMemo(() => {
    return game.readyPlayers.find(x => x === player.uid) !== undefined;
  }, [game, player]);

  const isRoundStarted = useMemo(() => {
    return game.rounds.length > 0;
  }, [game.rounds]);

  const isMyTurn = useMemo(() => {
    return game.currentHand && game.currentHand.uid === player.uid;
  }, [game, player]);

  const iSaidWord = useMemo(() => {
    return game.playerHasWord === player.uid;
  }, [game, player]);

  const canIEndTorn = useMemo(() => {
    if (isRoundStarted && isMyTurn) {
      return !(game.isLastCircle && iSaidWord);
    }

    return false;
  }, [isRoundStarted, isMyTurn, game, iSaidWord]);

  const canISayWord = useMemo(() => {
    if (isRoundStarted) {
      return !game.playerHasWord && isMyTurn;
    }

    return false;
  }, [isRoundStarted, game]);

  const gameStarted = useMemo(() => game.gameStatus !== 'notStarted', [game]);

  const canIStarNewRound = useMemo(() => {
    switch (game.gameStatus) {
      case 'notStarted':
        return game.allPlayersReadyToGame;
      case 'started':
      case 'endRound':
        return isMyTurn && game.isLastCircle && iSaidWord;
      case 'finished':
      case 'lastRound':
      default:
        return false;
    }
  }, [isMyTurn, game, iSaidWord]);

  useEffect(() => {
    if (game.gameStatus === 'finished') {
      // todo here we can process end game
      // window.alert('End game!');
    }
  }, [game]);

  return (
    <>
      <div className='md:w-5/6'>
        <div className='flex m-1.5 mb-1'>
          <button onClick={ () => socketGame.emit('game-ready-to-play', player.uid) } disabled={ isReadyPlayer }>I'm
            Ready
          </button>
          <button onClick={ handleClickNextRound } disabled={ !canIStarNewRound }>
            { gameStarted ? 'Next Round' : 'Start Round' }
          </button>
        </div>
        <div className='flex m-1.5 mb-2'>
          <button onClick={ onEndTurn } disabled={ !canIEndTorn }>End Turn</button>
          <button onClick={ onHasWord } disabled={ !canISayWord }>I has word</button>
        </div>
        {
          game.rounds.length > 0 && (
            <GameDeck game={ game } player={ player } handleMove={ handlePlayerMove } isMyTurn={ isMyTurn }/>
          )
        }
      </div>
      <div className='md:w-1/6 p-1.5'>
        { game.rounds.length
          ? <button onClick={ handleClickStartGame }
                    className='m-0 mb-2'>Restart Game</button>
          : <button onClick={ handleClickStartGame }
                    className='m-0 mb-2' disabled={ !game.allPlayersReadyToGame }>New Game</button> }
        { gameStarted && <RoundInfo game={ game }/> }
        <div className='flex text-lg font-bold'>Players:</div>
        <ul className='mb-2'>{
          game.players.map(p => (
            <li key={ p.uid }>{ game.readyPlayers.includes(p.uid) ? <CheckIcon/> : <MinusIcon/> } { p.username }</li>))
        }</ul>
        <button onClick={ () => socketGame.emit('game-reset') }
                className='m-0 mb-2' disabled={ false }>Reset
        </button>
      </div>
    </>
  );
};

export default GameBoard;