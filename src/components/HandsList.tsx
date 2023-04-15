import LetterCard from "./LetterCard";
import React, {FC, memo} from "react";

interface Props {
  hands: {[key: string]: Deck};
  players: Player[];
  isOpen?: boolean;
}

const HandsList: FC<Props> = ({hands, players, isOpen = false}) => (
  <>
    {Object.keys(hands).map((opponentUid, idx) => {
      const cards = hands[opponentUid];
      return (
        <div key={opponentUid} className='opponentHand'>
          <h3>{(players[opponentUid].username)}</h3>
          <div className='min-h-40 m-1 flex flex-wrap'>
            {cards.map((card) => (
              <LetterCard key={card.id} isOpen={isOpen} card={card}/>
            ))}
          </div>
        </div>
      )
    })}
  </>
);

export default HandsList;