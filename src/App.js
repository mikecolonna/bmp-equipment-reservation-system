import React, { Component } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import './App.css';
import ItemList from './ItemList.jsx';
import Cart from './Cart.jsx';

const movies = [
    "The Perambulators",
    "Mouthbreathers",
    "Light and Sound",
    "R.E.M.",
    "Other"
]

var EventEmitter = require('wolfy87-eventemitter');
var ee = new EventEmitter();

class App extends Component {
    render() {
      return (
        <Container className="App-container">
          <ItemList emitter={ee}/>
          <Cart movies={movies} emitter={ee}/>
        </Container>
      );
    }
}

export default App;
