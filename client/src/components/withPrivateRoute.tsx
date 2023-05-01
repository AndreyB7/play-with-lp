import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useCurrentPlayer from '../utils/useCurrentPlayer';

const withPrivateRoute = (Component) => {
  return () => {
    const router = useRouter();

    const { getPlayer } = useCurrentPlayer();

    useEffect(() => {
      if (typeof window != 'undefined') {
        const player = getPlayer();
        if (!player.username) {
          router.push('/');
        }
      }
    }, []);

    return <Component/>;
  };
}

export default withPrivateRoute