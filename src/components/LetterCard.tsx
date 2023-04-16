import React, { FC } from "react";

interface Props {
  card: Card,
  isOpen: boolean,
  cardCount: number,
}

const LetterCard: FC<Props> = ({ card, isOpen, cardCount }) => {
  const largeLetters = ['z', 'w', 't', 'm'];
  const classes = {
    smaller: `${ card.label.length === 2 ? ' card-center-letter--smaller' : '' }`,
    smallest: `${ largeLetters.includes(card.label) ? ' card-center-letter--smallest' : '' }`,
  }
  return (
    <div style={ { marginRight: `-${ cardCount > 8 ? 20 : 0 }px` } }
         className={ `card flex flex-col justify-between h-36 w-28 bg-white rounded text-black shadow shadow-black m-0.5 ${
           isOpen ? 'open' : 'close' }` }>
      { isOpen ? (<>
        <div className="flex flex-col uppercase card-letter-font px-1.5">
          <span>{ card.label }</span>
          <span className="text-sm">{ card.score }</span>
        </div>
        <span className={ `card-center-letter px-1${ classes.smaller }${ classes.smallest }` }>
                { card.label }
            </span>
        <div className="flex flex-col rotate-180 uppercase card-letter-font px-1.5">
          <span>{ card.label }</span>
          <span className="text-sm">{ card.score }</span>
        </div>
      </>) : (
        <div className="closed-card"></div>
      ) }
    </div>
  )
}
export default LetterCard;