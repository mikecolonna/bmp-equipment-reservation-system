import React, { Component } from 'react';
import { Button, Form, Table, Col, Row } from 'react-bootstrap';
import $ from 'jquery';

const uuid = require('uuid/v4');
const GSURL = 'https://script.google.com/macros/s/AKfycbzDeJ4P2PXNK8PZSrBg8_-PZ77nsM6-qbzddVaacjX3KfirOCc/exec';

class Cart extends Component {
    constructor(props) {
        super(props);
        this.props.emitter.addListener('addItem', this.addItemToCart.bind(this));
        this.state = {
            items_in_cart: []
        };
    }

    addItemToCart(name, quantity) {
        const new_item = {"name": name, "quantity": quantity};
        let idx = this.findInList(name, this.state.items_in_cart);   // -1 if not found
        if (idx >= 0) {
            this.state.items_in_cart[idx]["quantity"] = new_item.quantity;
            this.setState({items_in_cart: this.state.items_in_cart});
        } else {
            const new_state = [...this.state.items_in_cart, new_item];
            this.setState({items_in_cart: new_state});
        }
    }

    findInList(item_name, list) {
        for (let i = 0; i < list.length; i++) {
            if (list[i]["name"] === item_name) {
                return i;
            }
        }
        return -1;
    }

    renderItems() {
        let curr_row = 0;
        const items = this.state.items_in_cart.map(item => {
            if (item.quantity > 0) {
                const pos = curr_row++;
                return <tr id={pos}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td><Button onClick={() => this.handleRemove(pos)}><i className="fas fa-times"/></Button></td>
                    </tr>;
            }
            return;
        });
        console.log('rows: ' + curr_row);

        return items;
    }

    handleRemove = row_to_remove => {
        console.log("remove clicked for index: " + row_to_remove);
        this.setState(state => ({
            items_in_cart: state.items_in_cart.filter((row, j) => j !== row_to_remove)
        }));
    }

    renderMovieChoices() {
        const movies = this.props.movies.map(movie => {
            return <Form.Check
                    required
                    custom
                    name='movieChoice'
                    type='radio'
                    id={movie}
                    label={movie}
                    value={movie}/>
        });

        return movies;
    }

    // TODO: FIX GLITCH WHERE NOT ALL ITEMS LOAD TO SHEET
    // TODO: ADD SUCCESSFUL SUBMIT MESSAGE

    postData(e) {
        e.preventDefault();     // page won't refresh
        let form = e.target;
        const name = form['name'].value;
        const email = form['email'].value;
        const phone = form['phone'].value;
        const movie = form['movieChoice'].value;
        const startDate = form['startDate'].value;
        const endDate = form['endDate'].value;

        // get cart items/quantities from state
        const items = this.state.items_in_cart;

        // generate unique cart ID
        const id = "CART-"+uuid();

        items.forEach(function(item) {
            let request = {
                cartID: id,
                itemName: item.name,
                itemQuantity: item.quantity,
                userName: name,
                email: email,
                phone: phone,
                movie: movie,
                startDate: startDate,
                endDate: endDate,
                timestamp: new Date()
            }

            const url = GSURL + "?callback=?"
                              + "&func="+'SEND'
                              + "&cartID="+request.cartID
                              + "&itemName="+request.itemName
                              + "&itemQuantity="+request.itemQuantity
                              + "&userName="+request.userName
                              + "&email="+request.email
                              + "&phone="+request.phone
                              + "&movie="+request.movie
                              + "&startDate="+request.startDate
                              + "&endDate="+request.endDate
                              + "&timestamp="+request.timestamp

            $.ajax({
                method: "GET",
                dataType: "jsonp",
                contentType: "text/plain;charset=utf-8",
                url: url,
                success: function(data) {
                    console.log('Success! ' + data);
                }
            });
        });
    }

    render() {
        return (
            <div className='Cart-container'>
                <h1>CART</h1>
                <Form onSubmit={this.postData.bind(this)}>
                    <Table>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.renderItems()}
                        </tbody>
                    </Table>

                    <Form.Row>
                        <Form.Group as={Col} controlId='rent-name'>
                            <Form.Label><h6>Name</h6></Form.Label>
                            <Form.Control name='name' type="text" required/>
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col} controlId='rent-email'>
                            <Form.Label><h6>Email</h6></Form.Label>
                            <Form.Control name='email' type="email" required/>
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col} controlId='rent-phone'>
                            <Form.Label><h6>Phone Number</h6></Form.Label>
                            <Form.Control name='phone' type="text" required/>
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col} controlId='rent-movie'>
                            <Form.Label><h6>What movie do you work on?</h6></Form.Label>
                            {this.renderMovieChoices()}
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col} controlId="rent-start-date">
                            <Form.Label><h6>Proposed Rental Start Date</h6></Form.Label>
                            <Form.Control name='startDate' type="date" required/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="rent-start-date">
                            <Form.Label><h6>Proposed Rental End Date</h6></Form.Label>
                            <Form.Control name='endDate' type="date" required/>
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label><h6>Terms & Conditions</h6></Form.Label>
                            <Form.Label>
                                Read our terms and conditions <a href='https://docs.google.com/document/d/1qsF76tY8Y0Dkasu-cZJ_auZcIhApkqiYKnNis7sjeBw/edit?usp=sharing'>here</a>.

                                You will also be asked to sign a physical contract when you checkout this piece of equipment.
                            </Form.Label>
                            <Form.Check
                                custom
                                required
                                name='terms'
                                type='checkbox'
                                id='terms-checkbox'
                                controlId='rent-terms-checkbox'
                                label='I agree to the terms and conditions of renting BMP equipment.'
                                />
                        </Form.Group>
                    </Form.Row>

                    <Button variant='primary' type='submit'>
                        Checkout
                    </Button>
                </Form>
            </div>
        );
    }
}

export default Cart;
