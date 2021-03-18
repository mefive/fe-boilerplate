import { injectable } from 'inversify';
import {
  action,
  computed,
  makeAutoObservable,
  observable,
  runInAction,
} from 'mobx';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@injectable()
export class UserStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable user?: { name: string; age: number };

  @computed
  get userAge() {
    return this.user?.age;
  }

  @action
  async fetchUser(name: string) {
    const user = await of({ name, age: 35 }).pipe(delay(500)).toPromise();

    runInAction(() => (this.user = user));
  }
}
