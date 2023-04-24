import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import useCurrentPlayer from '../utils/useCurrentPlayer';

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
            className="main bg-white border rounded-md px-4 py-2 text-xl"
            disabled={username.length < 3}
          >
            Go!
          </button>
      </main>
    </div>
  );
}
