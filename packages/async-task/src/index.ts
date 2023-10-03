import { useProgress, ProgressHookResult } from "@rjshooks/use-progress"
import { useCallback, useEffect, useState } from "react"

export interface AsyncTaskHookResult<T> {
  progress: ProgressHookResult;
  data?: T;
  reload: () => Promise<void>;
}

export interface AsyncTaskHookInput<T> {
  loadOnCreation?: boolean;
  load: () => Promise<T>;
}

export const useAsyncTask = <T>(
  opts: AsyncTaskHookInput<T>
): AsyncTaskHookResult<T> => {
  const progress = useProgress();
  const [data, setData] = useState<T>();

  const reload = useCallback(async () => {
    setData(undefined);
    progress.reset();
    progress.setActiveStep("Loading");

    try {
      const ret = await opts.load();
      progress.setCompleted();
      setData(ret);
    } catch (err: any) {
      progress.setError(err as Error);
    }
  }, [opts, opts.load /*progress*/]);

  useEffect(() => {
    if (opts.loadOnCreation) {
      reload();
    }
  }, [opts.loadOnCreation, reload]);

  return {
    progress,
    data,
    reload,
  };
};
