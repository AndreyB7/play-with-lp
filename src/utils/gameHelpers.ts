import { getShuffledDeck } from './useShuffledDeck';

export const findNextPlayer = (currentPlayer: UID | undefined, players: Array<Player>): Player => {
  if (currentPlayer === undefined) {
    return players[0];
  }

  let currentIdx = players.findIndex(x => x.uid === currentPlayer);
  currentIdx = 1 + (currentIdx < 0 ? 0 : currentIdx);

  return players[(currentIdx % players.length)];
}

export const initNewRound = (game: Game, player: Player): Round => {
  const round: Round = {
    deck: getShuffledDeck(),
    hands: game.players.reduce((p, c) => ({ ...p, [`${ c.uid }`]: [] }), {}),
    table: [],
    score: {},
    croupier: player.uid,
    extraScoreAdded: '',
    turnState: {
      gotFromDeck: false,
      gotFromTable: false,
      pushedToTable: false,
    }
  };

  if (game.rounds.length > 0) {
    // This will fail if previously croupier left game
    round.croupier = findNextPlayer(game.rounds[0].croupier, game.players).uid;
  }

  const countCardsToHand = game.rounds.length + 3;
  for (let i = 0; i < countCardsToHand; i++) {
    game.players.forEach(player => {
      if (game.readyPlayers.includes(player.uid)) {
        round.hands[`${ player.uid }`].push({ ...round.deck.pop(), dropped: false })
      }
    });
  }
  round.table.push(round.deck.pop());

  return round;
}

export const getWinnerName = (game: Game): UID => {
  let max = -1;
  let uid;
  Object.keys(game.gameScore).forEach(function ( k) {
    if (max < +game.gameScore[`${k}`]) {
      max = +game.gameScore[`${k}`];
      uid = k;
    }
  });
  return game.players.find(x => x.uid === uid)?.username;
}