import { useState, useEffect } from 'react';
import type { RankItem } from '../types';
import { rankService } from '../services/rankService';

export function useRanks() {
  const [ranks, setRanks] = useState<RankItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    rankService.list()
      .then((data) => {
        if (isMounted) {
          setRanks(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { ranks, isLoading };
}
