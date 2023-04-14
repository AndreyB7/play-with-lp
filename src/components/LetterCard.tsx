import React, {FC} from "react";

interface Props {
    card: Card,
    isOpen: boolean,
}

const LetterCard: FC<Props> = ({ card, isOpen }) => {
    const largeLetters = ['Z', 'W', 'T', 'M'];
    const classes = {
        smaller: `${card.label.length === 2 ? ' card-center-letter--smaller' : ''}`,
        smallest: `${largeLetters.includes(card.label) ? ' card-center-letter--smallest' : ''}`,
    }
    return (
        <div className="card flex flex-col justify-between h-52 w-36 bg-white rounded-sm text-black shadow-2xl m-1 px-1">
            {isOpen ? (<>
            <div className="flex flex-col uppercase card-letter-font">
                <span className="text-2xl p-1 pb-0">{card.label}</span>
                <span className="pl-1">{card.score}</span>
            </div>
            <span className={`text-center uppercase card-center-letter pt-6 pl-1 pr-1${classes.smaller}${classes.smallest}`}>
                {card.label}
            </span>
            <div className="flex flex-col rotate-180 uppercase card-letter-font">
                <span className="text-2xl p-1 pb-0">{card.label}</span>
                <span className="pl-1">{card.score}</span>
            </div>
            </>) : (
                <div className="closed-card"></div>
            )}
        </div>
    )
}
export default LetterCard;