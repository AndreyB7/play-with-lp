type UseStoragePlayer = {
  getPlayer: () => Player;
  setPlayer: (data: Player) => Player;
  updatePlayer: (field: 'username' | 'uid' | 'sessionId', value: string) => Player;
  setError: (string) => void;
  getError: () => string;
}

const useCurrentPlayer = (): UseStoragePlayer => {
  const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')();

  const getPlayer = (): Player => {
    let data: Player = { uid: '', username: '', sid: ''};

    const rawData = isBrowser ? window['sessionStorage']['player'] : '';
    if (rawData) {
      data = { ...data, ...JSON.parse(rawData) }
    }

    return data as Player;
  }

  const setPlayer = (data: Player): Player => {
    if (isBrowser) {
      window['sessionStorage'].setItem('player', JSON.stringify(data));
    }

    return data;
  }

  const updatePlayer = (field, value): Player => {
    const player = getPlayer();

    return setPlayer({ ...player, [`${ field }`]: value });
  }

  const setError = (message) => {
    if (isBrowser) {
      window['sessionStorage'].setItem('error', message);
    }
  }

  const getError = () => {
    return isBrowser ? window['sessionStorage']['error'] : '';
  }

  return { getPlayer, setPlayer, updatePlayer, setError,  getError};
}

export default useCurrentPlayer;