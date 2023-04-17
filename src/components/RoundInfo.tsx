import React, {FC, memo, useMemo} from 'react';

interface Props {
  game: Game;
}

const RoundInfo: FC<Props> = ({game}) => {
  const currentRoundNumber: number = useMemo(() => game.rounds.length, [game]);
  const currentHand: string = useMemo(() => game.currentHand?.username ?? '', [game]);
  return (
    <div className='mb-2'>
      <div className='capitalize'>Game: {game.gameStatus}</div>
      {game.playerHasWord && <div>{game.players.find(x=>x.uid === game.playerHasWord).username} - Has Word!</div> }
      <div>Round: {currentRoundNumber}</div>
      <div>Current turn: {currentHand}</div>
    </div>
  );
};

export default memo(RoundInfo);