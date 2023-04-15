import React, {FC, useEffect, useState} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import LetterCard from "./LetterCard";
import HandsList from "./HandsList";

interface Props {
  player: Player;
  game: Game;
  handleMove: (game: Game) => void;
}

interface iCards {
  deck: Deck,
  table: Deck,
  playerHand: Deck,
}

const GameDeck: FC<Props> = ({game, player, handleMove}) => {

  const [cards, setCards] = useState<iCards>({
    deck: game.rounds[0].deck.slice(0, 5),
    table: game.rounds[0].table.slice(0, 5),
    playerHand: game.rounds[0].hands[`${player.uid}`],
  });

  useEffect(() => {
    setCards({
      deck: game.rounds[0].deck.slice(0, 5),
      table: game.rounds[0].table.slice(0, 5),
      playerHand: game.rounds[0].hands[`${player.uid}`]
    })
  }, [game])

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
      let removed;
      switch (source.droppableId) {
        case 'table':
        case 'deck':
          removed = sourceList.pop();
          break;
        default:
          removed = sourceList.splice(source.index, 1)[0];
          break;
      }

      switch (destination.droppableId) {
        case 'table':
        case 'deck':
          destinationList.push(removed);
          break;
        default:
          destinationList.splice(destination.index, 0, removed);
          break;
      }

      const newCards = {
        ...cards,
        [source.droppableId]: sourceList,
        [destination.droppableId]: destinationList,
      };

      setCards(newCards);
      updateGame(newCards);
    }
  };

  const updateGame = (cards) => {
    game.rounds[0] = {
      deck: cards.deck,
      table: cards.table,
      hands: {[`${player.uid}`]: cards.playerHand}, // only myHand to avoid other hands sort override.
    }
    handleMove(game);
  }

  const opponentsHands = (): { [key: string]: Deck } => {
    const hands = {...game.rounds[0].hands};
    delete hands[`${player.uid}`];
    return hands;
  }

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className='game-wrap flex flex-wrap'>
          {Object.keys(cards).map((part) => (
            <div key={part} className={`relative ${part === 'playerHand' ? 'w-full' : 'w-1/4'}`}>
              <h3>{part}</h3>
              <Droppable droppableId={part} direction="horizontal">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} className='min-h-40 m-1 flex flex-wrap'
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
                              marginRight: `${part === 'deck' || part === 'table' ? '-110px' : '0'}`,
                              border: snapshot.isDragging ? '1px solid red' : '0',
                              ...provided.draggableProps.style,
                            }}
                          >
                            <LetterCard key={card.id} isOpen={part !== 'deck'} card={card}/>
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
      {opponentsHands && (
        <HandsList
          players={game.players.filter(x => x.uid !== player.uid)}
          hands={opponentsHands()}
          isOpen={true}
        />)
      }
    </div>
  );
};

export default GameDeck;