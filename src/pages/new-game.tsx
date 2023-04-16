import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import useCurrentPlayer from '../utils/useCurrentPlayer';
import GameBoard from '../components/GameBoard';
import withPrivateRoute from '../components/withPrivateRoute';
import { useRouter } from "next/router";

let socketGame;

const NewGame = () => {

  const { getPlayer, setPlayer } = useCurrentPlayer();
  const player = getPlayer();

  const [game, setGame] = useState<Game | null>(null);
  const [connection, setConnection] = useState<boolean>(true);

  const router = useRouter();

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

    socketGame.on('game-reset', () => {
      router.push('/');
    });

    return socketGame;
  };

  if (game === null || connection) {
    return (
      <div>Connection...</div>
    )
  }

  return (
    <div className='container flex my-2 m-auto'>
      <GameBoard socketGame={ socketGame } game={ game } player={ player }/>
    </div>)
};

export default withPrivateRoute(NewGame);