import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import useCurrentPlayer from '../utils/useCurrentPlayer';
import GameBoard from '../components/GameBoard';
import withPrivateRoute from '../components/withPrivateRoute';
import { useRouter } from "next/router";

let socketGame;
let wasUnautorized = false;

const Game = () => {

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
    socketGame = io(undefined, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketGame.on("unauthorized", (message) => {
      wasUnautorized = true;
      setError(message);
      router.push('/');
    });

    socketGame.on("authorized", () => {
      wasUnautorized = false;
      socketGame.emit('connect-player', player);
    });

    socketGame.on('connect-success', player => {
      setPlayer(player);
      localStorage.setItem('uid', player.uid);
      socketGame.emit('game-join', player);
    });

    socketGame.on('player-joined', uid => {
      socketGame.emit('game-ready-to-play', uid);
    });

    socketGame.on('update-game', game => {
      process.env.NODE_ENV == 'development' && console.log('update-game', game);
      setConnection(false);
      setGame(game);
    });

    socketGame.on('game-reset', () => {
      router.push('/');
    });

    let attempts = 3;
    socketGame.on("disconnect", () => {
      // try to refresh page and reconnect
      // TODO check reconnect with login and in-game reload
      if (wasUnautorized && attempts > 0) {
        socketGame.emit('connect-player', player);
        attempts--;
        console.log(attempts);
      }
      // router.reload();
      console.log("disconnected by socket");
    });

    return socketGame;
  };

  if (game === null || connection) {
    return (
      <div className='p-2'>Connection...</div>
    )
  }

  return (
    <div className='container md:flex md:flex-wrap py-2 m-auto min-h-screen'>
      <GameBoard socketGame={ socketGame } game={ game } player={ player }/>
    </div>)
};

export default withPrivateRoute(Game);