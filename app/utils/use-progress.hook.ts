import ProgressBar from '@badrap/bar-of-progress';
import { useEffect } from 'react';
import { useGlobalPendingState } from 'remix-utils';

const progress = new ProgressBar({
  size: 2,
  color: '#8c8eb8',
  className: 'bar-of-progress',
  delay: 100
});

export function useProgress() {
  let state = useGlobalPendingState();
  useEffect(() => {
    if (state === 'pending') progress.start();
    if (state === 'idle') progress.finish();
  }, [state]);
}
