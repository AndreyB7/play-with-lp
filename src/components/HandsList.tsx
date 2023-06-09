import LetterCard from "./LetterCard";
import React, { FC } from "react";

interface Props {
  hands: { [key: string]: PlayersHand };
  players: Player[];
  isOpen?: boolean;
}

const HandsList: FC<Props> = ({ hands, players, isOpen = false }) => (
  <div className='playerHands' style={{minHeight: 176 * Object.keys(hands).length}}>
    { Object.keys(hands).map((opponentUid) => {
      const cards = hands[opponentUid];
      return (
        <div key={ opponentUid } className='opponentHand'>
          <h3 className='deck-part-title'>{ players.find(x => x.uid === opponentUid).username }</h3>
          <div className='min-h-40 m-1 flex flex-wrap opponentHand-wrap'>
            { cards.map((card) => (
              <LetterCard key={ card.id } isOpen={ isOpen } card={ card } cardCount={ cards.length }/>
            )) }
          </div>
        </div>
      )
    }) }
  </div>
)

export default HandsList;