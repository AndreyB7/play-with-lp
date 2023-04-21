type CountRoundScore = {
  countRoundScore: (data: Round) => void;
  countGameScore: (data: Game) => void;
}
const useScoreCount = (): CountRoundScore => {
  const countRoundScore = (round: Round) => {
    round.score = {};
    for (const uid in round.hands) {
      round.score[`${ uid }`] = round.hands[`${ uid }`].reduce((sum, c) => sum + c.score, 0)
    }
  }
  const countGameScore = (game: Game) => {
    game.players.forEach((player) => {
      game.gameScore[`${ player.uid }`] =
        game.rounds.reduce((sum, round) => sum + round.score[`${ player.uid }`], 0)
    })
  }

  return { countRoundScore, countGameScore }
}
export default useScoreCount;