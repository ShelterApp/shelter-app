import { reducerRegistry } from '../reducer-registry';
import reducer from './reducer';

const key = 'service';
reducerRegistry.register(key, reducer);

export { key };
export default {
  [key]: reducer,
};
