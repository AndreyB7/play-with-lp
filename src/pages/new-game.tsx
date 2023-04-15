import React, {useEffect, useMemo, useState} from 'react';
import io from 'socket.io-client';
import GameDeck from '../components/GameDeck';
import withPrivateRoute from '../components/withPrivateRoute';
import {log} from "util";

let socketGame;

const NewGame = () => {

  const [player, setPlayer] = useState<Player>({uid: '', username: ''});
  const [game, setGame] = useState<Game>({players: [], rounds: [], uid: ''});

  useEffect(() => {
    socketInitializer();
    setPlayer({uid: localStorage.getItem('uid'), username: localStorage.getItem('username')})
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
    }
  }

  const handleClickStartGame = () => {
    socketGame.emit('game-new', player);
  }
  const handleClickNextRound = () => {
    socketGame.emit('game-next-round');
  }

  const handlePlayerMove = (game:Game) => {
    socketGame.emit('game-move', game);
  }

  return (
    <div className='container m-auto'>
      {game.rounds.length
        ? <button onClick={handleClickStartGame}>Restart Game</button>
        : <button onClick={handleClickStartGame}>New Game</button>}
      <button onClick={handleClickJoinToGame} disabled={inGame}>I'm Ready</button>
      {(game.rounds.length > 0 && game.rounds.length < 8)
        ? <button onClick={handleClickNextRound} disabled={!inGame}>Next Round</button>
        : <button onClick={handleClickNextRound} disabled={!inGame}>Start Round</button>}
      <div
        className='flex flex-grow via-amber-200'>Players: {game.players.reduce((p, c) => `${p} ${c.username}`, '')}
      </div>
      <h1>Round: {game.rounds.length}</h1>
      <hr className='my-2'/>
      {game.rounds.length > 0 && inGame && (
        <GameDeck game={game} player={player} handleMove={handlePlayerMove}/>
      )}
    </div>
  )
};

export default withPrivateRoute(NewGame);