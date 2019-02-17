import React, { Component } from 'react';
import { ListGroup, Button, Pagination } from 'react-bootstrap';
import Item from './Item.jsx';
import './ItemList.css';
import $ from 'jquery';

const GSURL = 'https://script.google.com/macros/s/AKfycbzDeJ4P2PXNK8PZSrBg8_-PZ77nsM6-qbzddVaacjX3KfirOCc/exec';

// takes as input a list of items
class ItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            categories: [],
            activePage: ''
        };

        this.handlePageChange = this.handlePageChange.bind(this);
    }

    handlePageChange(page) {
        this.setState( { activePage: page })
    }

    componentDidMount() {
        // call google sheets script
        // populate items
        const url = GSURL + "?callback=?"
                          + "&func="+'READ';

        $.ajax({
            method: "GET",
            dataType: "jsonp",
            contentType: "text/plain;charset=utf-8",
            url: url,
            success: function(data) {
                // retrieve unique category labels
                let itemCategories = [...new Set(data.map(item => {
                    return item["CATEGORY"]
                }))];

                // update states
                this.setState( { items : data,
                                 categories: itemCategories,
                                 activePage : itemCategories[0] } )
            }.bind(this)
        });
    }

    renderPages() {
        // if no categories have been retrieved yet, render nothing
        if (this.state.categories === undefined || this.state.categories.length === 0) {
            return;
        }

        // otherwise, make a new page for each unique category
        let pages = this.state.categories.map(category => {
            return <Pagination.Item
                        key={category}
                        active={this.state.activePage === category}
                        onClick={() => this.handlePageChange(category)}>
                            {category}
                    </Pagination.Item>
        });

        return <Pagination>
                    {pages}
                </Pagination>
    }

    renderList() {
        // if items haven't been loaded yet, render a loading message
        if (this.state.items === undefined || this.state.items.length === 0) {
            return <div id='loading-items-message'>
                        <h1><i class="fas fa-spinner fa-spin"></i></h1>
                        <h3>
                            <span>Seeing what we've got in stock...</span>
                        </h3>
                        <h4>Get ready to make a movie!</h4>
                    </div>
        }

        // otherwise, load items in the currently selected category
        let items = [];
        let itemCount = 0;
        items = this.state.items.map(item => {
            if (item["DISPLAY?"] === "Y" && item["CATEGORY"] === this.state.activePage) {
                itemCount++;
                return <Item
                        className="List-card"
                        key={item["ITEM"]+"-"+itemCount}
                        name={item["ITEM"]}
                        img={item["IMAGE"]}
                        num_in_stock={item["AMOUNT"]}
                        info={item["NOTES"]}
                        emitter={this.props.emitter}></Item>
            }
       });

       return <ListGroup className="ItemList-container">
                    {items}
              </ListGroup>
    }

    render() {
        return (
            <div>
                {this.renderPages()}
                {this.renderList()}
            </div>
        );
    }
}

export default ItemList;
