import { Server } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { getShuffledDeck } from '../../utils/useShuffledDeck';

export const initGame: Game = {
  players: [],
  rounds: [],
  uid: uuidv4(),
  readyPlayers: [],
  allPlayersReadyToGame: false,
  currentHand: undefined,
  playerHasWord: undefined,
  isLastCircle: false,
  gameStatus: 'notStarted',
}

const limitRoundsCount = parseInt(process.env.LIMIT_ROUND_COUNT, 10) || 8;
const limitPlayersCount = parseInt(process.env.LIMIT_PLAYERS_COUNT, 10) || 8;

const currentGame: Game = { ...initGame };
const globalPlayersList: Array<Player> = [];

export default function SocketHandler(req, res) {
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onConnection = (socket) => {

    socket.on('access', (passkey: string) => {
      if (passkey === process.env.PASSWORD) {
        return socket.emit("authorized");
      }
      socket.emit("unauthorized", "Wrong Passkey");
      return socket.disconnect();
    })

    socket.on('connect-player', (player: Player) => {
      if (player.uid && globalPlayersList.some(p => p.uid === player.uid)) {
        if (player.sid !== socket.id) {
          // update reconnected player with new socket.id
          const inGamePlayer = currentGame.players.find(p => p.uid === player.uid);
          if (inGamePlayer) {
            inGamePlayer.sid = socket.id;
          }
          player.sid = socket.id;
        }
        socket.emit('connect-success', player);
        return;
      }
      player.uid = uuidv4();
      player.sid = socket.id;
      globalPlayersList.push(player);
      socket.emit('connect-success', player);
    })

    socket.on('disconnect', (reason) => {
      console.log('Disconnect (Reason: %s, ID: %s)', reason, socket.id);

      const idx = globalPlayersList.findIndex(p => p.uid === socket.id)
      if (idx > -1) {
        // Todo Here we can process disconnected player
        // notify player 'not ready'

        // clear inGame player
        currentGame.players = currentGame.players.filter(p => p.uid !== globalPlayersList[idx].uid);
        gameUpdate(currentGame);
        // globalPlayersList.splice(idx, 1);
      }
    })

    const gameUpdate = (newGameState: Game) => {
      socket.emit('update-game', newGameState);
      socket.broadcast.emit('update-game', newGameState);
    }

    const endTurn = () => {
      if (currentGame.rounds[0].deck.length === 0) {
        currentGame.rounds[0].deck = currentGame.rounds[0].table.slice(0, currentGame.rounds[0].table.length - 1);
      }

      let currentIdx = 1 + currentGame.players.findIndex(x => x.uid === currentGame.currentHand);

      // single player mode
      if (currentGame.players.length === 1) {
        currentIdx = 0;
      }

      let newHand = (currentIdx % currentGame.players.length);
      currentGame.currentHand = currentGame.players[newHand].uid;

      if (currentGame.playerHasWord === currentGame.currentHand) {
        currentGame.gameStatus = currentGame.gameStatus === 'lastRound' ? 'finished' : 'endRound';
      }

      gameUpdate(currentGame);
    }

    socket.on('game-join', (player: Player) => {
      let currentPlayer = currentGame.players.find(x => x.uid === player.uid);
      if (currentPlayer) {
        gameUpdate(currentGame);
        return;
      }
      if (currentGame.players.length === limitPlayersCount) {
        // Todo process over limit players
        return;
      }
      currentGame.players.push(player);
      if (currentGame.gameStatus === 'started') {
        // todo here we can send cards to new hand
      }
      socket.emit('player-joined');
      gameUpdate(currentGame);
    })

    socket.on('game-next-round', () => {
      if (currentGame.gameStatus === 'lastRound') {
        return;
      }

      const newRound: Round = {
        deck: getShuffledDeck(),
        hands: currentGame.players.reduce((p, c) => ({ ...p, [`${ c.uid }`]: [] }), {}),
        table: []
      };

      const countCardsToHand = currentGame.rounds.length + 3;
      for (let i = 0; i < countCardsToHand; i++) {
        currentGame.players.forEach(player => {
          if (currentGame.readyPlayers.includes(player.uid)) {
            newRound.hands[`${ player.uid }`].push(newRound.deck.pop())
          }
        });
      }
      newRound.table.push(newRound.deck.pop());
      if (currentGame.rounds.length === 0) {
        currentGame.currentHand = currentGame.players[0];
      }
      currentGame.rounds.unshift(newRound); // new round first
      currentGame.playerHasWord = undefined;
      currentGame.isLastCircle = false;
      currentGame.gameStatus = currentGame.rounds.length === limitRoundsCount ? 'lastRound' : 'started';

      gameUpdate(currentGame);
    })

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
      socket.emit('game-reset');
      socket.broadcast.emit('game-reset');
    })

    // Todo Let's think about make different event with "I'v got card form table", "I'v pushed card to table"...
    socket.on('game-move', (newGame:Game) => {
      const myUID = globalPlayersList.find(x => x.sid === socket.id).uid;

      currentGame.rounds[0] = {
        deck: newGame.rounds[0].deck,
        table: newGame.rounds[0].table,
        hands: {
          ...currentGame.rounds[0].hands,
          [`${ myUID }`]: newGame.rounds[0].hands[`${ myUID }`]
        }
      };
      gameUpdate(currentGame);
    })

    socket.on('game-ready-to-play', (uid: string) => {
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
    })

    socket.on('game-end-turn', () => {
      endTurn();
    })

    socket.on('game-has-word', (uid: string) => {
      currentGame.playerHasWord = uid;
      currentGame.isLastCircle = true;
      endTurn();
    })

    socket.on('log-state', () => {
      logState();
    })
  };

  // Define actions inside
  io.on("connection", onConnection);

  res.end();
}

function logState() {
  console.log('Game', currentGame);
  console.log('GlobalPlayers', globalPlayersList);
}
