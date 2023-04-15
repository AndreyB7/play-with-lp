import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';
import GameDeck from '../components/GameDeck';
import withPrivateRoute from '../components/withPrivateRoute';

let socketGame;

const NewGame = () => {

  const [player, setPlayer] = useState<Player>({ uid: '', username: '' });
  const [game, setGame] = useState<Game>({ players: [], rounds: [], uid: '', readyPlayers: [] });

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

  const handleClickJoinToGame = () => {
    if (!inGame) {
      socketGame.emit('game-join', player);
      // socketGame.emit('game-ready-to-play', player.uid);
    }
  }

  const handleClickStartGame = () => {
    socketGame.emit('game-new', player);
  }
  const handleClickNextRound = () => {
    socketGame.emit('game-next-round');
  }

  const handlePlayerMove = (game: Game) => {
    socketGame.emit('game-move', game);
  }

  // useEffect(() => {
  //     if (player && socketGame) {
  //         socketGame.emit('game-join', player);
  //     }
  // }, [socketGame, player]);

  const isReadyPlayer = useMemo(() => {
    return game.readyPlayers.find(x => x === player.uid) !== undefined;
  }, [game, player]);

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
        : <button onClick={ handleClickStartGame }>New Game</button> }
      <button onClick={ handleClickJoinToGame } disabled={ isReadyPlayer }>I'm Ready</button>
      { (game.rounds.length > 0 && game.rounds.length < 8)
        ? <button onClick={ handleClickNextRound } disabled={ !inGame }>Next Round</button>
        : <button onClick={ handleClickNextRound } disabled={ !inGame }>Start Round</button> }
      <div
        className='flex flex-grow via-amber-200'>Players: { game.players.reduce((p, c) => `${ p } ${ c.username }`, '') }
      </div>
      <h1>Round: { game.rounds.length }</h1>
      <hr className='my-2'/>
      { game.rounds.length > 0 && inGame && (
        <GameDeck game={ game } player={ player } handleMove={ handlePlayerMove }/>
      ) }
    </div>
  )
};

export default withPrivateRoute(NewGame);