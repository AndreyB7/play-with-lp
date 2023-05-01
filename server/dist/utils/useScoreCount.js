"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const useScoreCount = () => {
    const countRoundScore = (round) => {
        for (const uid in round.hands) {
            round.score[`${uid}`] = round.hands[`${uid}`].reduce((sum, c) => {
                if (c.dropped) {
                    sum = sum - c.score;
                    if (sum < 0) {
                        sum = 0;
                    }
                    return sum;
                }
                return sum + c.score;
            }, 0);
            // in case bonus scores was added
            if (round.extraScoreAdded === uid) {
                round.score[`${uid}`] = round.score[`${uid}`] + 10;
            }
        }
    };
    const countGameScore = (game) => {
        game.players.forEach((player) => {
            game.gameScore[`${player.uid}`] =
                game.rounds.reduce((sum, round) => { var _a; return (_a = sum + round.score[`${player.uid}`]) !== null && _a !== void 0 ? _a : 0; }, 0);
        });
    };
    return { countRoundScore, countGameScore };
};
exports.default = useScoreCount;
//# sourceMappingURL=useScoreCount.js.map