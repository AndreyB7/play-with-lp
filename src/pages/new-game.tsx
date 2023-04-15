import { number } from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';
import { initGame } from '../utils/sockets/messageHandler';
import GameDeck from '../components/GameDeck';
import withPrivateRoute from '../components/withPrivateRoute';

let socketGame;

const NewGame = () => {

  const [player, setPlayer] = useState<Player>({ uid: '', username: '' });
  const [game, setGame] = useState<Game>(initGame);

  useEffect(() => {
    socketInitializer();
    setPlayer({ uid: localStorage.getItem('uid'), username: localStorage.getItem('username') })
    return () => {
      socketGame.disconnect();
    };
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socketGame = io();
    socketGame.on('update-game', game => {
      setGame(game);
    })
    socketGame.on('player-joined', player => {
      setPlayer(player);
      localStorage.setItem('uid', player.uid)
    })
    return socketGame;
  };

  const inGame = useMemo(() => {
    return game.players.find(x => x.uid === player.uid) != undefined;
  }, [game, player]);

  const handleClickStartGame = () => {
    socketGame.emit('game-new', player);
  }
  const handleClickNextRound = () => {
    socketGame.emit('game-next-round');
  }

  const handlePlayerMove = (game: Game) => {
    socketGame.emit('game-move', game);
  }

  const isReadyPlayer = useMemo(() => {
    return game.readyPlayers.find(x => x === player.uid) !== undefined;
  }, [game, player]);

  const onEndTurn = () => {
    socketGame.emit('game-end-turn');
  }
  const isMyTurn = useMemo(() => {
    return inGame && game.players[game.currentHand] && game.players[game.currentHand].uid === player.uid;
  }, [inGame, game, player]);

  const iSaidWord = useMemo(() => {
    return game.playerHasWord === player.uid;
  }, [game, player]);

  const canIEndTorn = useMemo(() => {
    if (!isMyTurn) {
      return false;
    }
    return !(game.isLastCircle && iSaidWord);

  }, [isMyTurn, game, iSaidWord]);

  const canISayWord = useMemo(() => {
    return !game.playerHasWord && isMyTurn;
  }, [inGame, game]);

  const onHasWord = () => {
    socketGame.emit('game-has-word', player.uid);
  }

  const canIStarNewRound = useMemo(() => {
    return isMyTurn && game.isLastCircle && iSaidWord;
  }, [isMyTurn, game.isLastCircle, iSaidWord]);

  if (!inGame) {
    return (
      <>
        <p className="font-bold text-white text-xl">
          Hello { player.username }!
        </p>
        <>
          <button onClick={ () => socketGame.emit('game-join', player) }
                  className="bg-white rounded-md px-4 py-2 text-xl">Join to game
          </button>
        </>
      </>
    )
  }
  return (
    <div className='container m-auto'>
      { game.rounds.length
        ? <button onClick={ handleClickStartGame }>Restart Game</button>
        : <button onClick={ handleClickStartGame } disabled={ !game.allPlayersReadyToGame }>New Game</button> }
      <button onClick={ () => socketGame.emit('game-ready-to-play', player.uid) } disabled={ isReadyPlayer }>I'm Ready
      </button>
      { (game.rounds.length > 0 && game.rounds.length < 8)
        ? <button onClick={ handleClickNextRound } disabled={ !canIStarNewRound }>Next Round</button>
        : <button onClick={ handleClickNextRound } disabled={ !inGame }>Start Round</button> }
      <div
        className='flex flex-grow via-amber-200'>Players: { game.players.reduce((p, c) => `${ p } ${ c.username }`, '') }
      </div>
      <h1>Round: { game.rounds.length }</h1>
      <h1>Current turn: { game.players[game.currentHand].username }</h1>
      <button onClick={ onEndTurn } disabled={ !canIEndTorn }>End Turn</button>
      <button onClick={ onHasWord } disabled={ !canISayWord }>I has word</button>
      <hr className='my-2'/>
      { game.rounds.length > 0 && inGame && (
        <GameDeck game={ game } player={ player } handleMove={ handlePlayerMove }/>
      ) }
    </div>
  )
};

export default withPrivateRoute(NewGame);