// src/App.js
import React from 'react';
import './App.css';
import TicTacToe from './components/TicTacToe';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h3>Tic Tac Toe with Monte Carlo Tree Search</h3>
      </header>
      <TicTacToe />
    </div>
  );
}

export default App;
