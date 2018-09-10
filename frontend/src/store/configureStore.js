import {createStore, applyMiddleware, compose} from 'redux';
import chat from '../reducers';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    chat,
    composeEnhancers(applyMiddleware(thunk))
);

export default store;