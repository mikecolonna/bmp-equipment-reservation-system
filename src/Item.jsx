import React, { Component } from 'react';
import { Card, Button, InputGroup, FormControl } from 'react-bootstrap';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            num_requested: 0
        };
    }

    add() {
        if (this.state.num_requested < this.props.num_in_stock) {
            this.setState({num_requested: this.state.num_requested + 1});
        }
    }

    subtract() {
        if (this.state.num_requested > 0) {
            this.setState({num_requested: this.state.num_requested - 1});
        }
    }

    addToCart() {
        this.props.emitter.emitEvent('addItem', [this.props.name, this.state.num_requested]);
    }

    render() {
        return (
            <div className='Item-container'>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={this.props.img} />
                    <Card.Body>
                        <Card.Title>{this.props.name}</Card.Title>
                        <Card.Subtitle><strong>{this.props.num_in_stock}</strong> in stock!</Card.Subtitle>
                        <Card.Text>
                          {this.props.info}
                        </Card.Text>

                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <Button variant="outline-secondary" onClick={this.add.bind(this)}>+1</Button>
                            </InputGroup.Prepend>

                            <FormControl
                              aria-label="Quantity"
                              aria-describedby="basic-addon2"
                              readOnly={true}
                              value={this.state.num_requested}
                            />

                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={this.subtract.bind(this)}>-1</Button>
                            </InputGroup.Append>
                        </InputGroup>
                        <Button variant="primary" onClick={this.addToCart.bind(this)}>Add to Cart</Button>
                    </Card.Body>
                </Card>;
            </div>
        );
    }
}

export default Item;
