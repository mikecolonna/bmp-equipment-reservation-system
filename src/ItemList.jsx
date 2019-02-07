import React, { Component } from 'react';
import { ListGroup, Button, Pagination } from 'react-bootstrap';
import Item from './Item';
import $ from 'jquery';

const GSURL = 'https://script.google.com/macros/s/AKfycbzDeJ4P2PXNK8PZSrBg8_-PZ77nsM6-qbzddVaacjX3KfirOCc/exec';

// takes as input a list of items
class ItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            activePage: "SOUND"
        };

        this.handlePageChange = this.handlePageChange.bind(this);
    }

    handlePageChange(page) {
        console.log(page);
        console.log(page + " selected");
        this.setState( { activePage: page })
    }

    // TODO: make loading screen while component is fetching data

    componentDidMount() {
        // call google sheets script
        // populate items
        // work on images later
        const url = GSURL + "?callback=?"
                          + "&func="+'READ';

        $.ajax({
            method: "GET",
            dataType: "jsonp",
            contentType: "text/plain;charset=utf-8",
            url: url,
            success: function(data) {
                console.log(data);
                this.setState( { items : data} )
            }.bind(this)
        });
    }

    renderList(category) {
        console.log('rendering list!');
        let items = [];
        let itemCount = 0;
        items = this.state.items.map(item => {
            if (item["DISPLAY?"] === "Y" && item["CATEGORY"] === category) {
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

    // TODO: fix rendering of ND filters –– they don't disappear after displayed

    render() {
        return (
            <div>
                <Pagination>
                    <Pagination.Item
                    key="SOUND"
                    active={this.state.activePage === "SOUND"}
                    onClick={() => this.handlePageChange("SOUND")}>
                        SOUND
                    </Pagination.Item>
                    <Pagination.Item
                    key="CINEMATOGRAPHY"
                    active={this.state.activePage === "CINEMATOGRAPHY"}
                    onClick={() => this.handlePageChange("CINEMATOGRAPHY")}>
                        CINEMATOGRAPHY
                    </Pagination.Item>
                    <Pagination.Item
                    key="LIGHTING"
                    active={this.state.activePage === "LIGHTING"}
                    onClick={() => this.handlePageChange("LIGHTING")}>
                        LIGHTING
                    </Pagination.Item>
                    <Pagination.Item
                    key="MISC"
                    active={this.state.activePage === "MISC"}
                    onClick={() => this.handlePageChange("MISC")}>
                        MISC
                    </Pagination.Item>
                </Pagination>

                {this.renderList(this.state.activePage)}
            </div>
        );
    }
}

export default ItemList;
