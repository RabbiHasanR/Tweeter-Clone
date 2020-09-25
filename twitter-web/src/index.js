import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {TweetsComponents} from './tweets'
import * as serviceWorker from './serviceWorker';


const appEl = document.getElementById('root')
if(appEl){
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    appEl
  );
}

const e=React.createElement
const twitterEl = document.getElementById('twitter-el')
if(twitterEl){
  ReactDOM.render(
    <React.StrictMode>
      {/* <TweetsComponents username={twitterEl.dataset.username}/> */}
      {e(TweetsComponents,twitterEl.dataset)}
    </React.StrictMode>,
    twitterEl
  );
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
