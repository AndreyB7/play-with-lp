import React, { FC, useEffect, useState } from 'react';
import { Socket } from "socket.io";

interface Props {
  socket: Socket
}

const Dictionary: FC<Props> = ({ socket }) => {
  const [search, setSearch] = useState('');
  const [isWord, setIsWord] = useState(undefined);

  useEffect(() => {
    if (socket) {
      socket.on('checked-word', (isWord: boolean) => {
        setIsWord(isWord);
      });
    }
  }, [socket]);

  const handleChange = (e) => {
    setSearch(e.target.value);
    setIsWord(undefined);
  }

  const handleKeyPress = event => {
    if (event.charCode === 13) {
      event.preventDefault();
      checkWord();
    }
  };
  const checkWord = () => {
    if (search.length < 2) return
    socket.emit('check-word', search);
  }

  return (
    <div className='mb-28 w-full'>
      <div className='flex text-lg font-bold'>Dictionary:</div>
      <div className={
        `dictionary-search mw-200 rounded-md border-2 overflow-hidden ${ isWord !== undefined && (isWord ? 'yep' : 'nope')
        }` }>
        <input
          type="text"
          placeholder="Check word..."
          value={ search }
          className="outline-none p-1.5 w-full"
          onChange={ handleChange }
          onBlur={ checkWord }
          onKeyPress={ handleKeyPress }
        />
        { isWord !== undefined && <div className='text-center font-bold'>{ isWord ? 'Yep!' : 'Nope!' }</div> }
      </div>
    </div>
  )
}

export default Dictionary;