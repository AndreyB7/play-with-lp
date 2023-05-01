import React, { FC, memo, useMemo } from 'react';
import { getWinnerName } from "../utils/gameHelpers";

interface Props {
  game: Game;
}

const statusDict = new Map([
  ['notStarted', 'Not Started'],
  ['started', 'Started'],
  ['endRound', 'Round is Over'],
  ['lastRound', 'Last Round'],
  ['finished', 'Game Finished'],
]);

const RoundInfo: FC<Props> = ({ game }) => {
  const currentRoundCardNumber: number = useMemo(() => game.rounds.length + 2, [game]);

  const croupierName = useMemo(() => {
    return game.players.find(x => x.uid === game.rounds[0].croupier)?.username ?? '';
  }, [game.rounds[0]]);

  return (
    <div className='mb-2 w-full'>
      <div className='capitalize'>Status: { game.gameStatus !== 'finished'
        ? statusDict.get(game.gameStatus)
        : (`${ getWinnerName(game) } Wins!` ?? 'Draw!') }
      </div>
      <div>Round (# of Cards): { currentRoundCardNumber }</div>
      <div>Dealer: { croupierName }</div>
    </div>
  );
};

export default memo(RoundInfo);