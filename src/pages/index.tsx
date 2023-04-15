import {useState, useEffect} from "react";
import {v4 as uuidv4} from 'uuid';
import Link from 'next/link';

export default function Home() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storageUsername = localStorage.getItem('username');
    if (storageUsername) {
      setUsername(storageUsername);
    }
  }, []);

  const [chosenUsername, setChosenUsername] = useState('');

  return (
    <div className="flex items-center p-4 mx-auto min-h-screen justify-center flex-wrap">
      <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
        {!chosenUsername ? (
          <>
            <h3 className="font-bold text-white text-xl">
              How people should call you?
            </h3>
            <input
              type="text"
              placeholder="Identity..."
              value={username}
              className="p-3 rounded-md outline-none"
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={() => {
                setChosenUsername(username);
                localStorage.setItem('username', username);
              }}
              className="bg-white rounded-md px-4 py-2 text-xl"
            >
              Go!
            </button>
          </>
        ) : (
          <>
            <p className="font-bold text-white text-xl">
              Hello {username}!
            </p>
            <Link href='/new-game'>
              <button className="bg-white rounded-md px-4 py-2 text-xl">Join to game</button>
            </Link>
          </>
        )}
      </main>
    </div>
  );
}
