import { getShuffledDeck } from '../useShuffledDeck';
import { v4 as uuidv4 } from 'uuid';

export const initGame: Game = {
  players: [],
  rounds: [],
  uid: 'ggg',
  readyPlayers: [],
  allPlayersReadyToGame: false,
  currentHand: 0,
  playerHasWord: undefined,
  isLastCircle: false,
}

const game: Game = { ...initGame };

export default (io, socket) => {

  const gameUpdate = (newGameState: Game) => {
    socket.emit('update-game', newGameState);
    socket.broadcast.emit('update-game', newGameState);
  }

  const endTurn = () => {
    let newHand = (game.currentHand % game.players.length) + 1;
    game.currentHand = newHand >= game.players.length ? 0 : newHand;
    gameUpdate(game);
  }

  socket.on('game-join', (player: Player) => {
    const existingPlayer = game.players.find(x => x.uid === player.uid);
    if (player.uid && existingPlayer !== undefined) {
      existingPlayer.username = player.username; // in case we have updated username for same id
      gameUpdate(game);
      return;
    }
    player.uid = uuidv4();
    socket.emit('player-joined', player);

    game.players.push(player);
    game.readyPlayers = game.readyPlayers.filter(x => x !== player.uid);
    gameUpdate(game);
  })

  socket.on('game-next-round', () => {
    if (game.rounds.length === 8) {
      return;
    }

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
    game.rounds.unshift(newRound); // new round first
    game.playerHasWord = undefined;
    game.isLastCircle = false;

    gameUpdate(game);
  })

  socket.on('game-new', () => {
    game.rounds = [];
    game.players = [];
    game.readyPlayers = [];
    game.allPlayersReadyToGame = false;
    game.playerHasWord = undefined;
    gameUpdate(game);
  })

  // Todo Let's think about make different event with "I'v got card form table", "I'v pushed card to table"...
  socket.on('game-move', (newGame: Game) => {
    game.rounds[0].deck = newGame.rounds[0].deck;
    game.rounds[0].table = newGame.rounds[0].table;
    // Todo to if deck is empty - move rest from table
    game.rounds[0].hands = {
      ...game.rounds[0].hands,
      ...newGame.rounds[0].hands,
    }
    gameUpdate(game);
  })

  socket.on('game-ready-to-play', (uid: string) => {
    console.log(game);
    const isJoinedPlayer = game.players.find(x => x.uid === uid);
    if (isJoinedPlayer === undefined) {
      return;
    }

    const playerIsReady = game.readyPlayers.find(x => x === uid);
    if (playerIsReady) {
      return;
    }

    game.readyPlayers.push(uid);
    game.allPlayersReadyToGame = game.readyPlayers.length === game.players.length;

    gameUpdate(game);
  })

  socket.on('game-end-turn', () => {
    console.log('game-end-turn');
    endTurn();
  })

  socket.on('game-has-word', (uid: string) => {
    console.log('game-has-word');
    game.playerHasWord = uid;
    game.isLastCircle = true;
    endTurn();
  })
};
