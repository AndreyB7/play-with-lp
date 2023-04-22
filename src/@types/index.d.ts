type Card = {
  id: string,
  label: string;
  score: number;
}

type Deck = Array<Card>;

type Player = {
  uid: string;
  username: string;
  sid: string;
}

type PlayersHand = Array<Card & { dropped: boolean }>

type Round = {
  hands: { [key: string]: PlayersHand }
  table: Deck;
  deck: Deck;
  score: { [uid: string]: number }
}

type Game = {
  gid: string;
  players: Array<Player>;
  rounds: Array<Round>;
  gameScore: { [uid: string]: number };
  readyPlayers: Array<string>;
  allPlayersReadyToGame: boolean;
  currentHand: uid | undefined;
  playerHasWord: uid | undefined;
  isLastCircle: boolean;
  gameStatus: 'notStarted' | 'started' | 'endRound' | 'lastRound' | 'finished';
}

type GamesList = Array<Game>
