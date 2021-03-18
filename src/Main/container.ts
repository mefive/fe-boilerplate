import { Container } from 'inversify';
import { UserStore } from './stores/UserStore';

const container = new Container({
  autoBindInjectable: true,
});

container.bind(UserStore).to(UserStore).inSingletonScope();

export default container;
