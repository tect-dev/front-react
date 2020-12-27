import React from 'react';
import { Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <>
      <head>
        <meta name="description" content="세상 모든 테크트리, tect.dev" />
      </head>
      <header></header>
      <Route path="/" exact={true} component={Home} />
      <Route path="/about" component={About} />
    </>
  );
}

export default App;
