import React, { FC, memo } from 'react';

interface Props {
  game: Game;
}

const ScoreInfo: FC<Props> = ({ game }) => {

  if (!game.rounds.length) {
    return null
  }

  const reversedRounds = Array.from(game.rounds).reverse();

  return (
    <div className='mb-2 w-full'>
      <div className='flex text-lg font-bold'>Score:</div>
      <div className='score-list grid auto-cols-fr grid-flow-col'>
      { game.players.map(player => (
        <div key={ player.uid }>
          <div>{ player.username.substring(0, 3) }</div>
          <hr/>
          {reversedRounds.map((round,idx) => (
            <div key={idx}>{ round.score[`${ player.uid }`] ?? 0 }</div>
          ))}
          <hr className='my-0.5'/>
          <div>{ game.gameScore[`${ player.uid }`] ?? 0 }</div>
        </div>
      )) }
      </div>
    </div>
  );
};

export default memo(ScoreInfo);