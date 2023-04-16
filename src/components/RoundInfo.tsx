import React, { FC, memo, useMemo } from 'react';

interface Props {
  game: Game;
}

const RoundInfo: FC<Props> = ({ game }) => {
console.log(game.gameStatus);
  const currentRoundNumber: number = useMemo(() => game.rounds.length, [game]);
  const currentHand: string = useMemo(() => game.currentHand?.username ?? '', [game]);
  return (
    <div>
      <h1>Round: { currentRoundNumber }</h1>
      <h1>Current turn: { currentHand }</h1>
    </div>
  );
};

export default memo(RoundInfo);