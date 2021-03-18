import { Button } from 'antd';
import 'antd/dist/antd.less';
import _ from 'lodash';
import { runInAction } from 'mobx';
import { Observer, useLocalObservable } from 'mobx-react';
import React from 'react';
import UserPanel from './UserPanel';

export default function Main() {
  const state = useLocalObservable<{
    count: number;
  }>(() => ({ count: 1 }));

  return (
    <Observer>
      {() => (
        <>
          <div>
            <Button onClick={() => runInAction(() => (state.count += 1))}>
              Add
            </Button>
          </div>
          {_.range(state.count).map((i) => (
            <UserPanel key={`${i + 1}`} name={`mefive${i}`} />
          ))}
        </>
      )}
    </Observer>
  );
}
