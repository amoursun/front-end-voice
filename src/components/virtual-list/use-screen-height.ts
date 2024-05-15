import {
  useState,
  useLayoutEffect,
} from 'react';

export function useScreenHeight(ref: React.RefObject<HTMLElement>) {
  const [screenHeight, setScreenHeight] = useState(0);
  useLayoutEffect(() => {
    const scroll = ref.current;
    if (scroll) {
      setScreenHeight(scroll.clientHeight);
    }
  }, [ref]);
  return screenHeight;
}


