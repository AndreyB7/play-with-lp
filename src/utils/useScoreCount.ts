type CountRoundScore = {
  countRoundScore: (data: Round) => void;
  countGameScore: (data: Game) => void;
}
const useScoreCount = (): CountRoundScore => {
  const countRoundScore = (round: Round) => {
    for (const uid in round.hands) {
      round.score[`${ uid }`] = round.hands[`${ uid }`].reduce((sum, c) => {
        if (c.dropped) {
          sum = sum - c.score;
          if (sum < 0) {sum = 0}
          return sum;
        }
        return sum + c.score;
      }, 0)
      // in case bonus scores was added
      if (round.extraScoreAdded === uid) {
        round.score[`${ uid }`] = round.score[`${ uid }`] + 10;
      }
    }
  }
  const countGameScore = (game: Game) => {
    game.players.forEach((player) => {
      game.gameScore[`${ player.uid }`] =
        game.rounds.reduce((sum, round) => sum + round.score[`${ player.uid }`] ?? 0, 0)
    })
  }

  return { countRoundScore, countGameScore }
}
export default useScoreCount;