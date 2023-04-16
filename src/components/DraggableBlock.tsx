import React, { FC, useMemo } from 'react';
import { iCards } from '../components/GameDeck';
import LetterCard from '../components/LetterCard';
import { Draggable } from 'react-beautiful-dnd';


interface Props {
  cards: Deck;
  block: keyof iCards;
  limit?: number;
  provided: any;
  snapshot: any;
}

const DraggableBlock: FC<Props> = (
  {
    cards,
    block,
    limit = undefined,
    provided,
    snapshot
  }
) => {
  const showCards = useMemo(() => {
    if (limit) {
      return cards.slice(0, limit);
    }

    return cards;
  }, [cards, limit]);

  return (
    <div ref={ provided.innerRef } className='min-h-40 m-1 flex flex-wrap'
         style={ { display: 'flex', outline: snapshot.isDraggingOver ? '1px solid red' : '0' } }>
      {
        showCards.map((card, index) => (
          <Draggable key={ card.id } draggableId={ card.id } index={ index }>
            { (provided, snapshot) => (
              <div
                ref={ provided.innerRef }
                { ...provided.draggableProps }
                { ...provided.dragHandleProps }
                style={ {
                  display: 'flex',
                  userSelect: 'none',
                  marginRight: `${ block === 'deck' || block === 'table' ? '-110px' : '0' }`,
                  border: snapshot.isDragging ? '1px solid red' : '0',
                  ...provided.draggableProps.style,
                } }
              >
                <LetterCard key={ card.id } isOpen={ block !== 'deck' } card={ card }/>
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