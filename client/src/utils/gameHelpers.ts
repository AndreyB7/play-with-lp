export const getWinnerName = (game: Game): UID => {
  let max = -1;
  let uid: UID;
  Object.keys(game.gameScore).forEach(function ( k) {
    if (max < +game.gameScore[`${k}`]) {
      max = +game.gameScore[`${k}`];
      uid = k;
    }
  });
  return game.players.find(x => x.uid === uid)?.username;
}