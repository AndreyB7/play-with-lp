"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onConnection = exports.initGame = void 0;
const gameHelpers_1 = require("../utils/gameHelpers");
const uuid_1 = require("uuid");
const useScoreCount_1 = __importDefault(require("../utils/useScoreCount"));
const scrabble_word_list_json_1 = __importDefault(require("../utils/scrabble_word_list.json"));
const binarySearch_1 = __importDefault(require("../utils/binarySearch"));
exports.initGame = {
    players: [],
    rounds: [],
    gid: (0, uuid_1.v4)(),
    readyPlayers: [],
    allPlayersReadyToGame: false,
    currentHand: undefined,
    playerHasWord: undefined,
    isLastCircle: false,
    gameScore: {},
    gameStatus: 'notStarted',
};
const limitRoundsCount = parseInt(process.env.LIMIT_ROUND_COUNT, 10) || 8;
const limitPlayersCount = parseInt(process.env.LIMIT_PLAYERS_COUNT, 10) || 8;
const currentGame = Object.assign({}, exports.initGame);
const globalPlayersList = [];
const { countRoundScore, countGameScore } = (0, useScoreCount_1.default)();
const onConnection = (socket) => {
    socket.on('access', (passkey) => {
        if (passkey === process.env.PASSWORD) {
            return socket.emit("authorized");
        }
        socket.emit("unauthorized", "Wrong Passkey");
        return socket.disconnect();
    });
    socket.on('connect-player', (player) => {
        var _a;
        const currentPlayer = globalPlayersList.find(p => p.uid === player.uid);
        if (player.uid && currentPlayer) {
            currentPlayer.sid = socket.id;
            // update if username was changed + Safari bug with empty sessionStorage value.
            currentPlayer.username = (_a = player.username) !== null && _a !== void 0 ? _a : currentPlayer.username;
            // im-ready on reconnect
            if (!currentGame.readyPlayers.includes(currentPlayer.uid)) {
                currentGame.readyPlayers.push(player.uid);
            }
            socket.emit('connect-success', player);
            return;
        }
        player.uid = (0, uuid_1.v4)();
        player.sid = socket.id;
        globalPlayersList.push(player);
        socket.emit('connect-success', player);
    });
    socket.on('disconnect', (reason) => {
        console.log('Disconnect (Reason: %s, ID: %s)', reason, socket.id);
        const idx = globalPlayersList.findIndex(p => p.sid === socket.id);
        if (idx > -1) {
            // Here we can process disconnected player
            currentGame.readyPlayers = currentGame.readyPlayers.filter(uid => uid !== globalPlayersList[idx].uid);
            gameUpdate(currentGame);
            // globalPlayersList.splice(idx, 1);
        }
    });
    const gameUpdate = (newGameState) => {
        socket.emit('update-game', newGameState);
        socket.broadcast.emit('update-game', newGameState);
    };
    const endTurn = () => {
        if (currentGame.rounds[0].deck.length === 0) {
            currentGame.rounds[0].deck = currentGame.rounds[0].table.slice(0, currentGame.rounds[0].table.length - 1);
        }
        currentGame.rounds[0].turnState = {
            gotFromDeck: false,
            gotFromTable: false,
            pushedToTable: false,
        };
        currentGame.currentHand = (0, gameHelpers_1.findNextPlayer)(currentGame.currentHand, currentGame.players).uid;
        if (currentGame.playerHasWord === currentGame.currentHand) {
            currentGame.gameStatus = currentGame.gameStatus === 'lastRound' ? 'finished' : 'endRound';
        }
        // first count scoring
        if (currentGame.gameStatus === 'endRound' || currentGame.gameStatus === 'finished') {
            countRoundScore(currentGame.rounds[0]);
            countGameScore(currentGame);
        }
        gameUpdate(currentGame);
    };
    socket.on('game-join', (player) => {
        let currentPlayer = currentGame.players.find(x => x.uid === player.uid);
        if (currentPlayer) {
            gameUpdate(currentGame);
            return;
        }
        if (currentGame.players.length === limitPlayersCount) {
            // Todo process over limit players
            return;
        }
        const playerToJoin = globalPlayersList.find(x => x.uid === player.uid);
        if (!playerToJoin) {
            socket.emit("unauthorized", "Please Authorize");
            return;
        }
        currentGame.players.push(globalPlayersList.find(x => x.uid === player.uid));
        if (currentGame.gameStatus !== 'notStarted') {
            // here we send cards to new hand
            const countCardsToHand = currentGame.rounds.length - 1 + 3; // -1 - started game has min one round
            currentGame.rounds[0].hands[`${player.uid}`] = [];
            for (let i = 0; i < countCardsToHand; i++) {
                currentGame.rounds[0].hands[`${player.uid}`].push(Object.assign(Object.assign({}, currentGame.rounds[0].deck.pop()), { dropped: false }));
            }
        }
        socket.emit('player-joined', player.uid);
        gameUpdate(currentGame);
    });
    socket.on('game-next-round', (player) => {
        if (currentGame.gameStatus === 'lastRound') {
            return;
        }
        const newRound = (0, gameHelpers_1.initNewRound)(currentGame, player);
        currentGame.rounds.unshift(newRound); // new round first
        // This will fail if previously croupier left game
        currentGame.currentHand = (0, gameHelpers_1.findNextPlayer)(currentGame.rounds[0].croupier, currentGame.players).uid;
        // clear previous round deck to save object size
        if (currentGame.rounds.length > 1) {
            currentGame.rounds[1].deck = [];
        }
        currentGame.playerHasWord = undefined;
        currentGame.isLastCircle = false;
        currentGame.gameStatus = currentGame.rounds.length === limitRoundsCount ? 'lastRound' : 'started';
        gameUpdate(currentGame);
    });
    socket.on('game-reset', () => {
        globalPlayersList.length = 0; // clear global players array
        currentGame.players = [];
        currentGame.rounds = [];
        currentGame.readyPlayers = [];
        currentGame.allPlayersReadyToGame = false;
        currentGame.playerHasWord = undefined;
        currentGame.gameStatus = 'notStarted';
        currentGame.isLastCircle = false;
        currentGame.currentHand = undefined;
        currentGame.gameScore = {};
        socket.emit('game-reset');
        socket.broadcast.emit('game-reset');
    });
    socket.on('add-extra-score', (uid) => {
        if (!currentGame.rounds[0].score[`${uid}`]) {
            return;
        }
        currentGame.rounds[0].score[`${uid}`] = currentGame.rounds[0].score[`${uid}`] + 10;
        countGameScore(currentGame);
        currentGame.rounds[0].extraScoreAdded = uid;
        gameUpdate(currentGame);
    });
    // Todo Let's think about make different event with "I'v got card form table", "I'v pushed card to table"...
    socket.on('game-move', (newGame, player, reason) => {
        const newTurnState = Object.assign({}, currentGame.rounds[0].turnState);
        switch (reason) {
            case 'GotCardFromDeck':
                newTurnState.gotFromDeck = true;
                break;
            case 'GotCardFromTable':
                newTurnState.gotFromTable = true;
                break;
            case 'MoveCardToTable':
                newTurnState.pushedToTable = true;
                break;
            default:
                break;
        }
        currentGame.rounds[0] = Object.assign(Object.assign({}, newGame.rounds[0]), { hands: Object.assign(Object.assign({}, currentGame.rounds[0].hands), { [`${player.uid}`]: newGame.rounds[0].hands[`${player.uid}`] }), turnState: newTurnState });
        // update count scoring
        if (currentGame.gameStatus === 'endRound' || currentGame.gameStatus === 'finished') {
            countRoundScore(currentGame.rounds[0]);
            countGameScore(currentGame);
        }
        gameUpdate(currentGame);
    });
    socket.on('game-ready-to-play', (uid) => {
        const isJoinedPlayer = currentGame.players.find(x => x.uid === uid);
        if (isJoinedPlayer === undefined) {
            return;
        }
        const playerIsReady = currentGame.readyPlayers.find(x => x === uid);
        if (playerIsReady) {
            return;
        }
        currentGame.readyPlayers.push(uid);
        currentGame.allPlayersReadyToGame = currentGame.readyPlayers.length === currentGame.players.length;
        gameUpdate(currentGame);
    });
    socket.on('game-end-turn', () => {
        endTurn();
    });
    socket.on('game-has-word', (uid) => {
        currentGame.playerHasWord = uid;
        currentGame.isLastCircle = true;
        endTurn();
    });
    socket.on('check-word', (word) => {
        socket.emit('checked-word', (0, binarySearch_1.default)(scrabble_word_list_json_1.default, word.toLowerCase()));
    });
    socket.on('log-state', () => {
        logState();
    });
};
exports.onConnection = onConnection;
function logState() {
    console.log('Game', currentGame);
    console.log('GlobalPlayers', globalPlayersList);
}
//# sourceMappingURL=socket.js.map