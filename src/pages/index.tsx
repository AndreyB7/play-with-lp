import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import useCurrentPlayer from '../utils/useCurrentPlayer';
import Image from 'next/image'

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setFormError] = useState('');

  const { getPlayer, updatePlayer, getError, setError } = useCurrentPlayer();

  useEffect(() => {
    const storageUsername = localStorage.getItem('username') ?? '';
    const storagePassword = localStorage.getItem('passkey') ?? '';
    setUsername(storageUsername);
    setPassword(storagePassword);
    setFormError(getError());
    setError('');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('username', username);
    localStorage.setItem('passkey', password);
    const player = getPlayer();
    if (player) {
      updatePlayer('username', username);
    }
    router.push('/game');
  }

  return (
    <div className="flex items-center p-4 mx-auto min-h-screen justify-center flex-wrap">
      <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
        <Image
          width='540'
          height='300'
          src="/QQ-logo-sign-in@2x.png"
          unoptimized
        />
        <div className='text mw-5 mb-6'>
          <p>Welcome to Quiddler Queen! The ONLY way to play quiddler online with friends or loved ones.</p>
          <p>Please note, this version has a few bugs and little kinks still to work out. Please be patient if you encounter a bug and report it to <a href='mailto:loren@lorenpolster.com' target='_blank'>loren@lorenpolster.com</a>.
          </p>
          <p>Thank you for playing and enjoy!</p>
        </div>
        <h3 className="font-bold text-white text-xl">
          How people should call you?
        </h3>
        <input
          type="text"
          placeholder="Identity..."
          value={ username }
          className="p-3 border rounded-md outline-none"
          onChange={ (e) => setUsername(e.target.value) }
        />
        <input
          type="password"
          autoComplete="off"
          placeholder="Passkey..."
          value={ password }
          className="p-3 border rounded-md outline-none"
          onChange={ (e) => setPassword(e.target.value) }
        />
        { error && <div className='error'>{ error }</div> }
        <button
          onClick={ handleSubmit }
          className="main bg-white border rounded-md px-4 py-2 text-xl mb-6"
          disabled={ username.length < 3 }
        >
          Go!
        </button>
        <div className='text small'>
        <h3>Please note the following:</h3>
        <ul className='list'>
          <li>When playing on an iPad or touchscreen, you need to touch the card for second until you see it highlighted or moving, then you can drag it to move it.</li>
          <li>The game will not validate your words, only add your points. It’s up to you to decide what you count and don’t count. At the end of each round, all players will have the ability to place any unused cards in the subtract pile.</li>
          <li>The game will not automatically add 10 points for most or longest word. Adding 10+ is done by whoever went down that round by clicking the “+10” button next to the person’s name. The very last round currently does not allow this.</li>
          <li>There is no extra card dealt to the first person, but instead the person going first should draw from the deck.</li>
          <li>The dictionary will validate words from the official scrabble dictionary.</li>
        </ul>
        </div>
      </main>
    </div>
  );
}
