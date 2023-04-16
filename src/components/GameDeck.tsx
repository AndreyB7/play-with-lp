import React, { FC, useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DraggableBlock from '../components/DraggableBlock';
import HandsList from "./HandsList";

interface Props {
  player: Player;
  game: Game;
  handleMove: (game: Game) => void;
}

export interface iCards {
  deck: Deck,
  table: Deck,
  playerHand: Deck,
}

const GameDeck: FC<Props> = ({ game, player, handleMove }) => {

  const [cards, setCards] = useState<iCards>({
    deck: game.rounds[0].deck,
    table: game.rounds[0].table,
    playerHand: game.rounds[0].hands[`${ player.uid }`],
  });

  useEffect(() => {
    setCards({
      deck: game.rounds[0].deck,
      table: game.rounds[0].table,
      playerHand: game.rounds[0].hands[`${ player.uid }`]
    })
  }, [game])

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const { source, destination } = result;
    // Moving within the same list
    if (source.droppableId === destination.droppableId) {
      const newList = Array.from(cards[source.droppableId]);
      const [removed] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, removed);

      setCards({ ...cards, [source.droppableId]: newList });
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
      hands: { [`${ player.uid }`]: cards.playerHand }, // only myHand to avoid other hands sort override.
    }
    handleMove(game);
  }

  const opponentsHands = (): { [key: string]: Deck } => {
    const hands = { ...game.rounds[0].hands };
    delete hands[`${ player.uid }`];
    return hands;
  }

  return (
    <div>
      <DragDropContext onDragEnd={ handleDragEnd }>
        <div className='game-wrap flex flex-wrap'>
          { Object.keys(cards).map((part: keyof iCards) => (
            <div key={ part } className={ `relative ${ part === 'playerHand' ? 'w-full' : 'w-1/4' }` }>
              <h3>{ part }</h3>
              <Droppable droppableId={ part } direction="horizontal">
                {
                  (provided, snapshot) => (
                    <DraggableBlock
                      block={ part }
                      cards={ cards[part] }
                      limit={ part === 'deck' ? 5 : part === 'table' ? 3 : undefined }
                      provided={ provided }
                      snapshot={ snapshot }
                    />
                  )
                }
              </Droppable>
            </div>
          )) }
        </div>
      </DragDropContext>
      { opponentsHands && (
        <HandsList
          players={ game.players.filter(x => x.uid !== player.uid) }
          hands={ opponentsHands() }
          isOpen={ true }
        />)
      }
    </div>
  );
};

export default GameDeck;