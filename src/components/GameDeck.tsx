import React, { FC, useContext, useEffect, useMemo } from 'react';

interface Props {
    player: Player;
    game: Game;
}

const GameDeck: FC<Props> = ({ game, player }) => {

    const myCards: Deck = useMemo(() => {
        if (game.rounds.length === 0) {
            return [];
        }

        return game.rounds[game.rounds.length - 1].hands[`${ player.uid }`];
    }, [game, player]);

    return (
            <div>
                <div className='flex flex-grow via-amber-200'>Players: { game.players.reduce((p, c) => `${ p }, ${ c.username }`, '') }</div>
                <h1>Round: { game.rounds.length }</h1>
                { game.rounds.length ? <button>restart game</button> : <button>start game</button> }
                <ul>
                    { myCards.map((card, idx) => <li key={ idx }>{ card.label }</li>) }
                </ul>
            </div>
    );
};

export default GameDeck;