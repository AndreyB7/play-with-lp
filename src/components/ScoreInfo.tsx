import React, { FC, memo } from 'react';

interface Props {
  game: Game;
}

const ScoreInfo: FC<Props> = ({ game }) => {
  if (!game.rounds.length) {
    return null
  }
  const round = game.rounds[0];
  return (
    <div className='mb-2'>
      <div className='flex text-lg font-bold'>Score:</div>
      { game.players.map(player => (
        <div key={ player.uid }>
          <span>{ player.username }</span>
          <span> { round.score[`${ player.uid }`] ?? 0 }</span>
          <span> | { game.gameScore[`${ player.uid }`] ?? 0 }</span>
        </div>
      )) }
    </div>
  );
};

export default memo(ScoreInfo);