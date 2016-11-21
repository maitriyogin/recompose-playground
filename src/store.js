import { createStore, applyMiddleware } from 'redux';

import chatApp from './reducers';

const promise = () => next => action => {
  if (typeof action.then === 'function') {
    return action.then(next);
  }
  return next(action);
};

const logger = store => next => action => {
  console.group = console.group || console.log;
  console.groupEnd = console.groupEnd || console.log;
  console.group(action.type);
  console.log('%c prev state', 'color:gray', store.getState());
  console.log('%c action', 'color:blue', action);
  const result = next(action);
  console.log('%c next state', 'color:green', store.getState());
  console.groupEnd(action.type);
  return result;
};

const store = createStore(
    chatApp,
    applyMiddleware(promise, logger)
  );

export default store;
