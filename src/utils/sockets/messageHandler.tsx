import { getShuffledDeck } from '../useShuffledDeck';

const game: Game = { players: [], rounds: [], uid: 'ggg' };
export default (io, socket) => {

    const updateGame = (msg) => {
        // console.log('updateGame', socket.id, ' : ', msg);
        socket.broadcast.emit("inGameState", msg);
    };

    const createdMessage = (msg) => {
        socket.broadcast.emit("newIncomingMessage", msg);
    };

    socket.on("updateGameState", updateGame);
    socket.on("createdMessage", createdMessage);

    const gameUpdate = (newGameState: Game) => {
        socket.emit('update-game', newGameState);
        socket.broadcast.emit('update-game', newGameState);
    }

    socket.on('game-join', (player: Player) => {
        if (game.players.some(currentPlayer => currentPlayer.uid === player.uid)) {
            gameUpdate(game);
            return;
        }
        game.players.push(player);
        gameUpdate(game);
    })

    socket.on('game-next-round', () => {
        const newRound: Round = {
            deck: getShuffledDeck(),
            hands: game.players.reduce((p, c) => ({ ...p, [`${ c.uid }`]: [] }), {}),
            table: []
        };

        const countCardsToHand = game.rounds.length + 3;
        for (let i = 0; i < countCardsToHand; i++) {
            game.players.forEach(player => newRound.hands[`${ player.uid }`].push(newRound.deck.pop()));
        }
        newRound.table.push(newRound.deck.pop());
        game.rounds.push(newRound);

        gameUpdate(game);
    })

    socket.on('game-new', () => {
        game.rounds = [];
        game.players = [];
        gameUpdate(game);
    })
};
