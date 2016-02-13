import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import {Card, CardActions, CardHeader, CardText, FlatButton} from 'material-ui';

const ItemBox = React.createClass({
  loadFromServer() {
    $.ajax({
      url: "/retrieve",
      dataType: 'json',
      cache: false,
      success: (data) => {
        this.setState({data: data});
      },
      error: (xhr, status, err) => {
        console.error("/retrieve", status, err.toString());
      }
    });
  },
  getInitialState() {
    return {data: {list: []}};
  },
  componentDidMount() {
    this.loadFromServer();
  },
  render() {
    let styles = {
      itemBox: {
        maxWidth: 800,
        margin: "15px auto"
      }
    }
    return (
      <div className="itemBox" style={styles.itemBox}>
        <ItemList data={this.state.data} />
      </div>
    );
  }
});

const ItemList = React.createClass({
  render() {
    let list = _.toArray(this.props.data.list);
    let nodes = list.map(function(d) {
      let img;
      if (d.image) {
        img = <img src={d.image.src}/>;
      } else {
        img = <img src="http://lorempixel.com/300/300/nature/"/>;
      }
      return (
        <div key={d.item_id} className="item">
          {img}
          <div className="item-body">
            <div className="item-title">{d.resolved_title}</div>
            <a href={d.resolved_url} target="_blank">{d.resolved_url}</a>
          </div>
        </div>
      );
    });
    return (
      <div className="itemList">
        {nodes}
      </div>
    );
  }
});

export default ItemBox;
