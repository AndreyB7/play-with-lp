"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initNewRound = exports.findNextPlayer = void 0;
const useShuffledDeck_1 = require("./useShuffledDeck");
const findNextPlayer = (currentPlayer, players) => {
    if (currentPlayer === undefined) {
        return players[0];
    }
    let currentIdx = players.findIndex(x => x.uid === currentPlayer);
    currentIdx = 1 + (currentIdx < 0 ? 0 : currentIdx);
    return players[(currentIdx % players.length)];
};
exports.findNextPlayer = findNextPlayer;
const initNewRound = (game, player) => {
    const round = {
        deck: (0, useShuffledDeck_1.getShuffledDeck)(),
        hands: game.players.reduce((p, c) => (Object.assign(Object.assign({}, p), { [`${c.uid}`]: [] })), {}),
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
        round.croupier = (0, exports.findNextPlayer)(game.rounds[0].croupier, game.players).uid;
    }
    const countCardsToHand = game.rounds.length + 3;
    for (let i = 0; i < countCardsToHand; i++) {
        game.players.forEach(player => {
            if (game.readyPlayers.includes(player.uid)) {
                round.hands[`${player.uid}`].push(Object.assign(Object.assign({}, round.deck.pop()), { dropped: false }));
            }
        });
    }
    round.table.push(round.deck.pop());
    return round;
};
exports.initNewRound = initNewRound;
//# sourceMappingURL=gameHelpers.js.map