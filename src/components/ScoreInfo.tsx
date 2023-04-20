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
      { game.players.map(player => (
        <div key={ player.uid }>
          <span>{ player.username }</span>
          <span> { round.score && round.score[`${player.uid}`] }</span>
        </div>
      )) }
    </div>
  );
};

export default memo(ScoreInfo);