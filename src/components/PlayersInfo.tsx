import CheckIcon from "./svg/check.svg";
import MinusIcon from "./svg/minus.svg";
import React, { FC } from "react";

interface Props {
  game: Game;
}

const PlayersInfo: FC<Props> = ({ game }) => (
  <div className='mb-2 w-full'>
    <div className='flex text-lg font-bold'>Players:</div>
    <ul>{
      game.players.map(p => (
        <li key={ p.uid }>{ game.readyPlayers.includes(p.uid)
          ? <CheckIcon style={ { color: '#00CC33' } }/>
          : <MinusIcon style={ { color: '#FF0033' } }/> } { p.username }
        </li>))
    }</ul>
  </div>
)

export default PlayersInfo;