import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import useCurrentPlayer from '../utils/useCurrentPlayer';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { updatePlayer } = useCurrentPlayer();

  useEffect(() => {
    const storageUsername = localStorage.getItem('username');
    const storagePassword = localStorage.getItem('password');
    const error = localStorage.getItem('error');
    if (storageUsername) {
      setUsername(storageUsername);
      setPassword(storagePassword);
      setError(error);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('username', username);
    updatePlayer('username', username);
    localStorage.setItem('password', password);
    updatePlayer('password', password);
    localStorage.setItem('error', '');
    router.push('/new-game');
  }

  return (
    <div className="flex items-center p-4 mx-auto min-h-screen justify-center flex-wrap">
      <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
        <h3 className="font-bold text-white text-xl">
          How people should call you?
        </h3>
        <form className="w-64 gap-4 flex flex-col items-center justify-center" onSubmit={ handleSubmit }>
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
          {error && <div className='error'>{error}</div>}
        <button
          onClick={handleSubmit}
          className="bg-white border rounded-md px-4 py-2 text-xl"
        >
          Go!
        </button>
        </form>
      </main>
    </div>
  );
}
