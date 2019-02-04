import React, { Component } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import Item from './Item';

// takes as input a list of items
class ItemList extends Component {
    renderList() {
        const items = this.props.items.map(item => {
           return <Item
                    className="List-card"
                    key={item.name}
                    name={item.name}
                    img={item.img}
                    num_in_stock={item.num_in_stock}
                    info={item.info}
                    emitter={this.props.emitter}></Item>;
       });

       return items;
    }

    render() {
        return (
            <ListGroup className="ItemList-container">
                {this.renderList()}
            </ListGroup>
        );
    }
}

export default ItemList;
