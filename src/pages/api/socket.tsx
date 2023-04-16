import { Server } from "socket.io";
import { getShuffledDeck } from '../../utils/useShuffledDeck';
import { v4 as uuidv4 } from 'uuid';

export const initGame: Game = {
  players: [],
  rounds: [],
  uid: uuidv4,
  readyPlayers: [],
  allPlayersReadyToGame: false,
  currentHand: 0,
  playerHasWord: undefined,
  isLastCircle: false,
  gameStatus: 'notStarted',
}

const limitRoundsCount = parseInt(process.env.LIMIT_ROUND_COUNT, 10) || 8;
const limitPlayersCount = parseInt(process.env.LIMIT_PLAYERS_COUNT, 10) || 8;

const currentGame: Game = { ...initGame };
const globalPlayersList: Array<Player & { id: string }> = [];

export default function SocketHandler(req, res) {
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onConnection = (socket) => {
    console.log('Connected new player (ID: %s)', socket.id);
    const player = { id: socket.id, uid: '', username: 'Unknown' };

    globalPlayersList.push(player);
    socket.emit('connect-success', player);

    socket.on('disconnect', (reason) => {
      console.log('Disconnect (Reason: %s, ID: %s)', reason, socket.id);

      const idx = globalPlayersList.findIndex(c => c.id === socket.id)
      if (idx > -1) {
        // Todo Here we can process disconnected player
        // currentGame.players = currentGame.players.filter(p => p.uid !== globalPlayersList[idx].uid);
        // gameUpdate(currentGame);
        // globalPlayersList.splice(idx, 1);
      }

      console.log(globalPlayersList);
    })

    const gameUpdate = (newGameState: Game) => {
      socket.emit('update-game', newGameState);
      socket.broadcast.emit('update-game', newGameState);
    }

    const endTurn = () => {
      if (currentGame.rounds[0].deck.length === 0) {
        currentGame.rounds[0].deck = currentGame.rounds[0].table.slice(0, currentGame.rounds[0].table.length - 1);
      }
      let newHand = (currentGame.currentHand % currentGame.players.length) + 1;
      currentGame.currentHand = newHand >= currentGame.players.length ? 0 : newHand;

      if (currentGame.playerHasWord === currentGame.players[currentGame.currentHand].uid) {
        currentGame.gameStatus = currentGame.gameStatus === 'lastRound' ? 'finished' : 'endRound';
      }

      gameUpdate(currentGame);
    }

    socket.on('game-join', (data: Player) => {
      console.log('game-join', data);
      let isNewPlayer = false;
      let player = currentGame.players.find(x => x.uid === data.uid);
      if (!player) {
        if (currentGame.players.length === limitPlayersCount) {
          // Todo process over limit players
          return;
        }
        player = {
          ...data,
          uid: uuidv4()
        }
        isNewPlayer = true;
        socket.emit('player-joined', player);
      }

      player.username = data.username; // in case we have updated username for same id
      const idx = globalPlayersList.findIndex(x => x.id === socket.id);
      if (idx > -1) {
        globalPlayersList[idx] = { ...globalPlayersList[idx], ...player };
      }

      if (isNewPlayer) {
        currentGame.players.push(player);
        if (currentGame.gameStatus === 'started') {
          // todo here we can send cards to new hand
        }
      }
      currentGame.readyPlayers = currentGame.readyPlayers.filter(x => x !== player.uid);
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
        currentGame.players.forEach(player => newRound.hands[`${ player.uid }`].push(newRound.deck.pop()));
      }
      newRound.table.push(newRound.deck.pop());
      currentGame.rounds.unshift(newRound); // new round first
      currentGame.playerHasWord = undefined;
      currentGame.isLastCircle = false;
      currentGame.gameStatus = currentGame.rounds.length === limitRoundsCount ? 'lastRound' : 'started';

      gameUpdate(currentGame);
    })

    socket.on('game-new', () => {
      currentGame.rounds = [];
      currentGame.readyPlayers = [];
      currentGame.allPlayersReadyToGame = false;
      currentGame.playerHasWord = undefined;
      currentGame.gameStatus = 'notStarted';
      currentGame.isLastCircle = false;
      currentGame.currentHand = 0;
      gameUpdate(currentGame);
    })

    // Todo Let's think about make different event with "I'v got card form table", "I'v pushed card to table"...
    socket.on('game-move', (newGame: Game) => {
      currentGame.rounds[0].deck = newGame.rounds[0].deck;
      currentGame.rounds[0].table = newGame.rounds[0].table;
      currentGame.rounds[0].hands = {
        ...currentGame.rounds[0].hands,
        ...newGame.rounds[0].hands,
      }
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
      console.log('game-end-turn');
      endTurn();
    })

    socket.on('game-has-word', (uid: string) => {
      console.log('game-has-word');
      currentGame.playerHasWord = uid;
      currentGame.isLastCircle = true;
      endTurn();
    })
  };

  // Define actions inside
  io.on("connection", onConnection);

  res.end();
}
