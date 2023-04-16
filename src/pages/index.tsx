import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import useCurrentPlayer from '../utils/useCurrentPlayer';

export default function Home() {
  const router = useRouter();
  const [ username, setUsername ] = useState('');
  const { updatePlayer } = useCurrentPlayer();

  useEffect(() => {
    const storageUsername = localStorage.getItem('username');
    if (storageUsername) {
      setUsername(storageUsername);
    }
  }, []);

  const handleClick = () => {
    localStorage.setItem('username', username);
    updatePlayer('username', username);
    router.push('/new-game');
  }

  return (
    <div className="flex items-center p-4 mx-auto min-h-screen justify-center flex-wrap">
      <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
        <h3 className="font-bold text-white text-xl">
          How people should call you?
        </h3>
        <input
          type="text"
          placeholder="Identity..."
          value={ username }
          className="p-3 rounded-md outline-none"
          onChange={ (e) => setUsername(e.target.value) }
        />
        <button
          onClick={ handleClick }
          className="bg-white rounded-md px-4 py-2 text-xl"
        >
          Go!
        </button>
      </main>
    </div>
  );
}
