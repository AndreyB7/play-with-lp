import React, {FC, memo, useMemo} from 'react';

interface Props {
  game: Game;
}

const RoundInfo: FC<Props> = ({game}) => {
  const currentRoundCardNumber: number = useMemo(() => game.rounds.length + 2, [game]);
  const currentHand: string = useMemo(() =>
    game.players.find(x => x.uid === game.currentHand)?.username ?? '', [game]
  );
  return (
    <div className='mb-2 w-full'>
      <div className='flex text-lg font-bold'>Game:</div>
      <div className='capitalize'>Status: {game.gameStatus}</div>
      <div>Round: {currentRoundCardNumber}
        {game.playerHasWord && <span> ({game.players.find(x=>x.uid === game.playerHasWord).username.slice(0,3)} - Has Word!)</span> }
      </div>
      <div>Current turn: {currentHand}</div>
    </div>
  );
};

export default memo(RoundInfo);