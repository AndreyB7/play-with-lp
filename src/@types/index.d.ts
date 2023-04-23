type UID = string;

type Card = {
  id: string,
  label: string;
  score: number;
  dropped?: boolean;
}

type Deck = Array<Card>;

type Player = {
  uid: UID;
  username: string;
  sid: string;
}

type PlayersHand = Array<Card>

type Round = {
  hands: { [key: UID]: PlayersHand }
  table: Deck;
  deck: Deck;
  score: { [uid: UID]: number }
  croupier: UID;
  turnState: {
    gotFromDeck: boolean;
    gotFromTable: boolean;
    pushedToTable: boolean;
  }
}

type Game = {
  gid: UID;
  players: Array<Player>;
  rounds: Array<Round>;
  gameScore: { [uid: UID]: number };
  readyPlayers: Array<string>;
  allPlayersReadyToGame: boolean;
  currentHand: UID | undefined;
  playerHasWord: UID | undefined;
  isLastCircle: boolean;
  gameStatus: 'notStarted' | 'started' | 'endRound' | 'lastRound' | 'finished';
}

type GameUpdateReason = 'GotCardFromTable' | 'GotCardFromDeck' | 'MoveCardToTable' | 'SortCards';