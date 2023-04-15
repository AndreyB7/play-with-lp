import { getShuffledDeck } from '../useShuffledDeck';
import {v4 as uuidv4} from 'uuid';

const game: Game = { players: [], rounds: [], uid: 'ggg'
};
export default (io, socket) => {

    const gameUpdate = (newGameState: Game) => {
        socket.emit('update-game', newGameState);
        socket.broadcast.emit('update-game', newGameState);
    }

    socket.on('game-join', (player: Player) => {
        const existingPlayer = game.players.find(x => x.uid === player.uid);
        if (player.uid && existingPlayer !== undefined) {
            existingPlayer.username = player.username; // in case we have updated username for same id
            gameUpdate(game);
            return;
        }
        player.uid = uuidv4();
        game.players.push(player);
        socket.emit('player-joined', player);
        gameUpdate(game);
    })

    socket.on('game-next-round', () => {
        const newRound: Round = {
            deck: getShuffledDeck(),
            hands: game.players.reduce((p, c) => ({ ...p, [`${ c.uid }`]: [] }), {}),
            table: []
        };

        if (game.rounds.length === 8) {
            game.rounds = [];
        }

        const countCardsToHand = game.rounds.length + 3;
        for (let i = 0; i < countCardsToHand; i++) {
            game.players.forEach(player => newRound.hands[`${ player.uid }`].push(newRound.deck.pop()));
        }
        newRound.table.push(newRound.deck.pop());
        game.rounds.unshift(newRound); // new round first

        gameUpdate(game);
    })

    socket.on('game-new', () => {
        game.rounds = [];
        game.players = [];
        gameUpdate(game);
    })

    socket.on('game-move', (newGame: Game) => {
        game.rounds[0].deck = newGame.rounds[0].deck;
        game.rounds[0].table = newGame.rounds[0].table;
        game.rounds[0].hands = {
            ...game.rounds[0].hands,
            ...newGame.rounds[0].hands,
        }
        gameUpdate(game);
    })
};
