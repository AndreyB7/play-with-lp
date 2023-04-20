import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import useCurrentPlayer from '../utils/useCurrentPlayer';
import GameBoard from '../components/GameBoard';
import withPrivateRoute from '../components/withPrivateRoute';
import { useRouter } from "next/router";

let socketGame;

const NewGame = () => {

  const { getPlayer, setPlayer, setError } = useCurrentPlayer();
  const player = getPlayer();

  const [game, setGame] = useState<Game | null>(null);
  const [connection, setConnection] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    socketInitializer()
      .then(socket => {
        socket.emit('access', localStorage.getItem('passkey'));
      });

    return () => {
      socketGame.disconnect();
    };
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socketGame = io();

    socketGame.on("unauthorized", (message) => {
      setError(message);
      router.push('/');
    });

    socketGame.on("authorized", () => {
      socketGame.emit('connect-player', player);
    });

    socketGame.on('connect-success', player => {
      setPlayer(player);
      localStorage.setItem('uid', player.uid);
      socketGame.emit('game-join', player);
    });

    socketGame.on('player-joined', data => {
      console.log('player-joined', data);
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
      router.push('/');
      console.log("disconnected by socket");
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