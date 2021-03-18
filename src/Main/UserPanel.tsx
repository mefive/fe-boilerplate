import { Spin } from 'antd';
import { runInAction } from 'mobx';
import { Observer, useLocalObservable } from 'mobx-react';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';
import React from 'react';
import container from './container';
import { MainStore } from './stores/MainStore';

export default function UserPanel(props: { name: string }) {
  const mainStore = React.useMemo(() => container.resolve(MainStore), []);

  const state = useLocalObservable<{
    initializing?: IPromiseBasedObservable<any>;
  }>(() => ({}));

  React.useEffect(() => {
    runInAction(() => {
      state.initializing = fromPromise(mainStore.init(props.name));
    });
  }, []);

  return (
    <Observer>
      {() => (
        <div>
          User:{' '}
          {state.initializing?.state === 'pending' ? (
            <Spin />
          ) : (
            JSON.stringify(mainStore.userStore.user)
          )}
        </div>
      )}
    </Observer>
  );
}
