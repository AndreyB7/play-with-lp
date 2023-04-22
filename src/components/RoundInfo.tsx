import React, { FC, memo, useMemo } from 'react';

interface Props {
  game: Game;
}

const RoundInfo: FC<Props> = ({ game }) => {
  const currentRoundNumber: number = useMemo(() => game.rounds.length, [game]);
  const currentHand: string = useMemo(() => {
    return game.players.find(x => x.uid === game.currentHand)?.username ?? '';
  }, [game]);

  const croupierName = useMemo(() => {
    return game.players.find(x => x.uid === game.rounds[0].croupier)?.username ?? '';
  }, [game.rounds[0]]);

  return (
    <div className='mb-2 w-full'>
      <div className='flex text-lg font-bold'>Game:</div>
      <div className='capitalize'>Status: { game.gameStatus }</div>
      <div>Round: { currentRoundNumber }
        { game.playerHasWord &&
          <span> ({ game.players.find(x => x.uid === game.playerHasWord).username.slice(0, 3) } - Has Word!)</span> }
      </div>
      <div>Croupier: { croupierName }</div>
      <div>Current turn: { currentHand }</div>
    </div>
  );
};

export default memo(RoundInfo);