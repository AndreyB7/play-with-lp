import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';
import GameDeck from '../components/GameDeck';
import withPrivateRoute from '../components/withPrivateRoute';

let socketGame;

const NewGame = () => {

    const [player, setPlayer] = useState<Player>({ uid: '', username: '' });
    const [game, setGame] = useState<Game>({ players: [], rounds: [], uid: '' });

    useEffect(() => {
        socketInitializer();
        setPlayer({ uid: uuidv4(), username: localStorage.getItem('username') });
    }, []);

    const socketInitializer = async () => {
        await fetch("/api/socket");

        socketGame = io();

        socketGame.on('update-game', game => {
            setGame(game);
        })
    };

    const inGame = useMemo(() => {
        return game.players.find(x => x.username === player.username) != undefined;
    }, [game, player]);

    const handleClickJoinToGame = () => {
        if (!inGame) {
            socketGame.emit('game-join', player);
        }
    }
    const handleClickNextRound = () => {
        socketGame.emit('game-next-round');
    }

    return <>
        <button onClick={ handleClickJoinToGame } disabled={ inGame }>I'm ready</button>
        <button onClick={ handleClickNextRound } disabled={ !inGame }>Next Round</button>
        <GameDeck game={ game } player={ player }/>
    </>
};

export default withPrivateRoute(NewGame);