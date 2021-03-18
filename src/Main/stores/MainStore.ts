import { inject, injectable } from 'inversify';
import { action, makeAutoObservable } from 'mobx';
import { UserStore } from './UserStore';

@injectable()
export class MainStore {
  constructor(@inject(UserStore) readonly userStore: UserStore) {
    makeAutoObservable(this);
  }

  @action
  init(name: string) {
    return this.userStore.fetchUser(name);
  }
}
