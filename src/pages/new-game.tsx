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
        socket.emit('access', player);
      });

    return () => {
      socketGame.disconnect();
    };
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socketGame = io();

    socketGame.on("unauthorized", (message) => {
      localStorage.setItem('error', message);
      router.push('/');
    });

    socketGame.on("authorized", () => {
      delete player.password;
      socketGame.emit('connect-player', player);
    });

    socketGame.on('connect-success', player => {
      socketGame.emit('game-join', player);
    });

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

    socketGame.on("disconnect", () => {
      console.log("disconnected by socket");
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
    <div className='container md:flex md:flex-wrap py-2 m-auto min-h-screen'>
      <GameBoard socketGame={ socketGame } game={ game } player={ player }/>
    </div>)
};

export default withPrivateRoute(NewGame);