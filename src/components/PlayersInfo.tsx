import CheckIcon from "./svg/check.svg";
import MinusIcon from "./svg/minus.svg";
import Plus10Icon from "./svg/plus10.svg";
import React, { FC } from "react";

interface Props {
  game: Game;
  player: Player;
  canIStarNewRound: boolean;
  addExtraScore: (uid: UID) => void
}

const PlayersInfo: FC<Props> = ({ game, player,canIStarNewRound, addExtraScore }) => {
  const canAddExtraScore = canIStarNewRound && game.gameStatus !== 'notStarted';
  const handleAddScore = (e) => {
    e.currentTarget.disabled = true;
    addExtraScore(e.currentTarget.dataset.uid);
  }

  return (
    <div className='mb-2 w-full'>
      <div className='flex text-lg font-bold'>Players:</div>
      <ul>{
        game.players.map(p => (
          <li key={ p.uid }
              className={ `player mw-200${ (game.currentHand === p.uid) ? ' current' : '' }` }
          >{ game.readyPlayers.includes(p.uid)
            ? <CheckIcon style={ { color: '#00CC33' } }/>
            : <MinusIcon style={ { color: '#FF0033' } }/> }
            <div>{ p.username }</div>
            { game.playerHasWord === p.uid && <div style={{marginLeft:5}}>  Has Word!</div> }
            { canAddExtraScore &&
              <button className='score-plus' data-uid={ p.uid } onClick={ handleAddScore }>
                <Plus10Icon className='plus10' style={ { color: '#fff' } }/>
              </button> }
          </li>))
      }</ul>
    </div>
  )
}

export default PlayersInfo;