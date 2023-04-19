type UseStoragePlayer = {
  getPlayer: () => Player;
  setPlayer: (data: Player) => Player;
  updatePlayer: (field: 'username' | 'uid' | 'password', value: string) => Player;
}

const useCurrentPlayer = (): UseStoragePlayer => {
  const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')();

  const getPlayer = (): Player => {
    let data: Player = { uid: '', username: '', password: '' };

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

  return { getPlayer, setPlayer, updatePlayer };
}

export default useCurrentPlayer;