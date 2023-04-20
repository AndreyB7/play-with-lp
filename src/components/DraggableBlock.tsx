import React, { FC, useMemo } from 'react';
import { iCards } from './GameDeck';
import LetterCard from '../components/LetterCard';
import { Draggable } from 'react-beautiful-dnd';


interface Props {
  cards: Deck;
  block: keyof iCards;
  limit?: number;
  provided: any;
  snapshot: any;
  isMyTurn: boolean;
  gotCardFromDeck: boolean;
  gotCardFromTable: boolean;
}

const DraggableBlock: FC<Props> = (
  {
    cards = [], // TODO empty-hand error fix, remove after in-round player join handle
    block,
    limit = undefined,
    provided,
    snapshot,
    isMyTurn,
    gotCardFromDeck,
    gotCardFromTable
  }
) => {
  const showCards = useMemo(() => {
    if (limit) {
      return cards.slice(-limit);
    }
    return cards;
  }, [cards, limit]);

  const isDragDisabled = (part: keyof iCards) => {
    let result = false;
    switch (part) {
      case 'deck':
        result = !isMyTurn || (gotCardFromDeck || gotCardFromTable);
        break;
      case 'table':
        result = !isMyTurn || (gotCardFromDeck || gotCardFromTable);
        break;
      default:
        break;
    }
    return result;
  }

  return (
    <div ref={ provided.innerRef }
         className={ `min-height-card m-1 flex flex-wrap ${ block }-drag-wrap${ snapshot.isDraggingOver ? ' someOver' : '' }` }
         style={ { borderColor: snapshot.isDraggingOver ? '#fff' : 'transparent' } }>
      {
        showCards.map((card, index) => (
          <Draggable
            key={ card.id }
            draggableId={ card.id }
            index={ index }
            isDragDisabled={ isDragDisabled(block) }
          >
            { (provided) => (
              <div
                ref={ provided.innerRef }
                { ...provided.draggableProps }
                { ...provided.dragHandleProps }
                style={ {
                  display: 'inline-flex',
                  userSelect: 'none',
                  ...provided.draggableProps.style,
                } }
              >
                <LetterCard key={ card.id } isOpen={ block !== 'deck' } card={ card } cardCount={ showCards.length }/>
              </div>
            ) }
          </Draggable>
        ))
      }
      { provided.placeholder }
    </div>
  );
};

export default DraggableBlock;