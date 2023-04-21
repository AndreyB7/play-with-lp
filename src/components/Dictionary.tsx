import React, { FC, useEffect, useState } from 'react';
import { Socket } from "socket.io";

interface Props {
  socket: Socket
}

const Dictionary: FC<Props> = ({ socket }) => {
  const [search, setSearch] = useState('');
  const [isWord, setIsWord] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on('checked-word', (isWord: boolean) => {
        setIsWord(isWord);
      });
    }
  }, [socket]);

  const handleChange = (e) => {
    setSearch(e.target.value);
    setIsWord(false);
  }

  const handleKeyPress = event => {
    if (event.charCode === 13) {
      event.preventDefault();
      checkWord();
    }
  };
  const checkWord = () => {
    if (search.length < 3) return
    socket.emit('check-word', search);
  }

  return (
    <div className='mb-2 w-full'>
      <div className='flex text-lg font-bold'>Dictionary:</div>
      <input
        type="text"
        style={ {
          outlineColor: isWord ? 'green' : ''
        } }
        placeholder="Check word..."
        value={ search }
        className="border rounded-md outline-none p-1.5"
        onChange={ handleChange }
        onBlur={ checkWord }
        onKeyPress={ handleKeyPress }
      />
    </div>
  )
}

export default Dictionary;