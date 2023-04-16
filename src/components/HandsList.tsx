import LetterCard from "./LetterCard";
import React, { FC } from "react";

interface Props {
  hands: { [key: string]: Deck };
  players: Player[];
  isOpen?: boolean;
}

const HandsList: FC<Props> = ({ hands, players, isOpen = false }) => (
  <>
    { Object.keys(hands).map((opponentUid) => {
      const cards = hands[opponentUid];
      return (
        <div key={ opponentUid } className='opponentHand'>
          <h3 className='deck-part-title'>{ players.find(x => x.uid === opponentUid).username }</h3>
          <div className='min-h-40 m-1 flex flex-wrap'>
            { cards.map((card) => (
              <LetterCard key={ card.id } isOpen={ isOpen } card={ card } cardCount={ cards.length }/>
            )) }
          </div>
        </div>
      )
    }) }
  </>
);

export default HandsList;