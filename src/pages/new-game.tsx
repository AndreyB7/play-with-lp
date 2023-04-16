import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import useCurrentPlayer from '../utils/useCurrentPlayer';
import GameBoard from '../components/GameBoard';
import withPrivateRoute from '../components/withPrivateRoute';

let socketGame;

const NewGame = () => {

  const { getPlayer, setPlayer } = useCurrentPlayer();
  const player = getPlayer();

  const [game, setGame] = useState<Game | null>(null);
  const [connection, setConnection] = useState<boolean>(true);

  useEffect(() => {
    socketInitializer()
      .then(socket => {
        console.log('socket initialized');
        socket.emit('game-join', player);
      });

    return () => {
      socketGame.disconnect();
    };
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socketGame = io();

    socketGame.on('player-joined', data => {
      console.log('player-joined', data);
      setPlayer(data);
    });

    socketGame.on('update-game', game => {
      console.log('update-game', game);
      setConnection(false);
      setGame(game);
    });

    return socketGame;
  };

  if (game === null || connection) {
    return (
      <div>Connection...</div>
    )
  }

  return <GameBoard socketGame={ socketGame } game={ game } player={ player }/>
};

export default withPrivateRoute(NewGame);