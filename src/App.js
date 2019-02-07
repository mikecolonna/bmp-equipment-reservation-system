import React, { Component } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import ItemList from './ItemList';
import Cart from './Cart';

const items = [
    {
        name: "Nikon D7000",
        img: "assets/nikond7000.jpg",
        num_in_stock: 2,
        info: "A good camera."
    },
    {
        name: "Manfrotto Tripod",
        img: "assets/manfrotto.jpg",
        num_in_stock: 4,
        info: "One leg is broken."
    },
    {
        name: "Manfrotto Tripod",
        img: "assets/manfrotto.jpg",
        num_in_stock: 4,
        info: "One leg is broken."
    },
    {
        name: "Manfrotto Tripod",
        img: "assets/manfrotto.jpg",
        num_in_stock: 4,
        info: "One leg is broken."
    }
]

const movies = [
    "Bad Vibes",
    "Sometimes I Want To Cut Off My Hands",
    "One Man's Trash",
    "Landing Strip"
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
