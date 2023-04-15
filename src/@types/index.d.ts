type Card = {
    id: string,
    label: string;
    score: number;
}

type Deck = Array<Card>;

type Player = {
    uid: string;
    username: string;
}

type Round = {
    hands: { [key: string]: Deck }
    table: Deck;
    deck: Deck;
}

type Game = {
    uid: string;
    players: Array<Player>;
    rounds: Array<Round>;
    readyPlayers: Array<string>;
    allPlayersReadyToGame: boolean;
}

type GamesList = Array<Game>