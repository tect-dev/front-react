import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { applyMiddleware, createStore } from 'redux';
import rootReducer from './redux/index';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import ReduxThunk from 'redux-thunk';

// logger 미들웨어는 마지막 순서에 와야함.
const reduxStore = createStore(
  rootReducer,
  applyMiddleware(ReduxThunk, logger)
);

ReactDOM.render(
  <Provider store={reduxStore}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
