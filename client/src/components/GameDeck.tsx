import React, { FC, useEffect, useMemo, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Socket } from 'socket.io-client';
import DraggableBlock from '../components/DraggableBlock';
import HandsList from "./HandsList";

interface Props {
  player: Player;
  game: Game;
  socket: Socket;
  isMyTurn: boolean;
  isRoundEnd: boolean;
}

export interface iCards {
  deck: Deck;
  table: Deck;
  drop: Deck;
  playerHand: Deck;
}

const partNames = {
  deck: 'Deck',
  table: 'Discard',
  drop: 'Subtract',
  playerHand: 'My Hand',
}

const GameDeck: FC<Props> = (
  { game,
    player,
    socket,
    isMyTurn,
    isRoundEnd
  }) => {

  const round = useMemo(() => game.rounds[0], [game.rounds]);
  const { gotFromDeck, gotFromTable, pushedToTable } = useMemo(() => {
    if (round) {
      return round.turnState;
    }

    return {
      gotFromDeck: false,
      gotFromTable: false,
      pushedToTable: false,
    }
  }, [round]);

  const [cards, setCards] = useState<iCards>({
    deck: game.rounds[0].deck,
    table: game.rounds[0].table,
    drop: game.rounds[0].hands[`${ player.uid }`].filter(x => x.dropped),
    playerHand: game.rounds[0].hands[`${ player.uid }`],
  });

  useEffect(() => {
    setCards({
      deck: game.rounds[0].deck,
      table: game.rounds[0].table,
      drop: game.rounds[0].hands[`${ player.uid }`].filter(x => x.dropped),
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
      updateGame({ ...cards, [source.droppableId]: newList }, 'SortCards');
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
        case 'playerHand':
          if (destination.droppableId === 'drop') {
            removed = sourceList[source.index];
            break;
          }
          removed = sourceList.splice(source.index, 1)[0];
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
        case 'drop':
          removed.dropped = true;
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

      let reason: GameUpdateReason;
      if (source.droppableId === 'deck') {
        reason = 'GotCardFromDeck';
      }
      if (source.droppableId === 'table') {
        reason = 'GotCardFromTable';
      }
      if (destination.droppableId === 'table') {
        reason = 'MoveCardToTable';
      }

      updateGame(newCards, reason);
    }
  };

  const updateGame = (cards, reason: GameUpdateReason) => {
    setCards(cards);

    const sortDropped = [...cards.playerHand.filter(x => !x.dropped), ...cards.drop];

    game.rounds[0] = {
      ...game.rounds[0],
      deck: cards.deck,
      table: cards.table,
      hands: { [`${ player.uid }`]: sortDropped }, // only myHand to avoid other hands sort override
    }

    socket.emit('game-move', game, player, reason);
  }

  const opponentsHands = (): { [key: string]: Deck } => {
    const hands = { ...game.rounds[0].hands };
    delete hands[`${ player.uid }`];
    return hands;
  }

  const isDropDisabled = (part: keyof iCards) => {
    switch (part) {
      case 'deck':
        return true;
      case 'drop':
        return  game.gameStatus === 'started';
      case 'table':
        if (!isMyTurn || round === undefined) {
          return true;
        }
        return !(gotFromDeck || gotFromTable) || pushedToTable;
      default: // 'playerHand'
        return false; //game.gameStatus !== 'started' && game.gameStatus !== 'lastRound';
    }
  }

  const handsList = useMemo(() => (
    <HandsList
      players={ game.players.filter(x => x.uid !== player.uid) }
      hands={ opponentsHands() }
      isOpen={ game.gameStatus === 'endRound' || game.gameStatus === 'finished' }
    />
  ), [game.gameStatus, game.players])

  const getCards = (cards, part) => {
    const limit = part === 'deck' ? 2 : part === 'table' ? 2 : undefined;
    if (part === 'playerHand') {
      return cards[part].filter(x => !x.dropped);
    }
    if (limit) {
      return cards[part].slice(-limit);
    }
    return cards[part];
  }

  return (
    <div>
      <DragDropContext onDragEnd={ handleDragEnd }>
        <div className='game-wrap flex flex-wrap'>
          { Object.keys(cards).map((part: keyof iCards) => (
            <div key={ part } className={
               `relative ${
                 isRoundEnd && 'end-round' } ${
                part } ${
                isMyTurn && 'my-turn'} ${
                part === 'playerHand' ? 'w-full' : 'min-w-max' }`
            }>
              <h3 className='deck-part-title'>{ partNames[part] }</h3>
              <Droppable droppableId={ part } direction="horizontal" isDropDisabled={ isDropDisabled(part) }>
                {
                  (provided, snapshot) => (
                    <DraggableBlock
                      block={ part }
                      cards={ getCards(cards, part) }
                      provided={ provided }
                      snapshot={ snapshot }
                      isMyTurn={ isMyTurn }
                      isRoundEnd={isRoundEnd}
                      gotCardFromDeck={ gotFromDeck }
                      gotCardFromTable={ gotFromTable }
                    />
                  )
                }
              </Droppable>
            </div>
          )) }
        </div>
      </DragDropContext>
      { handsList }
    </div>
  );
};

export default GameDeck;