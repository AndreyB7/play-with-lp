import React, {FC, useEffect, useState} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import LetterCard from "./LetterCard";

interface Props {
  player: Player;
  game: Game;
}

const parts = ['desc', 'discard', 'playerHand'];

const GameDeck: FC<Props> = ({game, player}) => {

  const [currentRound, setCurrentRound] = useState(game.rounds[game.rounds.length - 1])

  const getOpponentsHands = () => {
    const playersUid = Object.keys(currentRound.hands);
    const playersHands = Object.values(currentRound.hands);
    const myIdx = playersUid.findIndex(uid => player.uid === uid);
    delete playersHands[myIdx];
    return playersHands;
  }

  const [cards, setCards] = useState({
    desc: [currentRound.deck.pop()],
    discard: [currentRound.deck.pop()],
    playerHand: currentRound.hands[`${player.uid}`],
  });

  useEffect(() => {
    setCurrentRound(game.rounds[game.rounds.length - 1]);
  }, [game])

  useEffect(() => {
    setCards({
      desc: [currentRound.deck.pop()],
      discard: [currentRound.deck.pop()],
      playerHand: currentRound.hands[`${player.uid}`]
    })
  }, [currentRound])

  const opponentHands = getOpponentsHands();

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const {source, destination} = result;
    // Moving within the same list
    if (source.droppableId === destination.droppableId) {
      const newList = Array.from(cards[source.droppableId]);
      const [removed] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, removed);

      setCards({...cards, [source.droppableId]: newList});
    }
    // Moving to a different list
    else {
      const sourceList = Array.from(cards[source.droppableId]);
      const destinationList = Array.from(cards[destination.droppableId]);
      const [removed] = sourceList.splice(source.index, 1);
      destinationList.splice(destination.index, 0, removed);

      setCards({
        ...cards,
        [source.droppableId]: sourceList,
        [destination.droppableId]: destinationList,
      });
    }
  };

  return (
    <div>
      {opponentHands.length && opponentHands.map((opponentHand,idx) => {
        return (
          <div className='opponentHand'>
            <h3>Opponent {idx+1}</h3>
            <div className='flex mb-4 border border-amber-300'>
              {opponentHand.map((card) => (
                <LetterCard key={card.id} isOpen={false} card={card}/>
              ))}
            </div>
          </div>
        )
      })}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className='game-desc-wrap flex flex-wrap'>
          {parts.map((part) => (
            <div key={part} className={`${part === 'discard' ? 'w-1/3' : 'w-2/3'}`}>
              <h3>{part}</h3>
              <Droppable droppableId={part} direction="horizontal">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} className='min-h-52 m-1 flex flex-wrap'
                       style={{display: 'flex', outline: snapshot.isDraggingOver ? '1px solid red' : '0'}}>
                    {cards[part].map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              display: 'flex',
                              userSelect: 'none',
                              border: snapshot.isDragging ? '1px solid red' : '0',
                              ...provided.draggableProps.style,
                            }}
                          >
                            <LetterCard key={card.id} isOpen={part !== 'desc'} card={card}/>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default GameDeck;