import CheckIcon from "./svg/check.svg";
import MinusIcon from "./svg/minus.svg";
import React, { FC } from "react";

interface Props {
  game: Game;
}

const PlayersInfo: FC<Props> = ({ game }) => (
  <div className='mb-2'>
    <div className='flex text-lg font-bold'>Players:</div>
    <ul>{
      game.players.map(p => (
        <li key={ p.uid }>{ game.readyPlayers.includes(p.uid)
          ? <CheckIcon style={ { color: 'lightgreen' } }/>
          : <MinusIcon style={ { color: 'hotpink' } }/> } { p.username }
        </li>))
    }</ul>
  </div>
)

export default PlayersInfo;