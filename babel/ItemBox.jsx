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
    return (
      <div className="itemBox">
        <ItemList data={this.state.data} />
      </div>
    );
  }
});

const ItemList = React.createClass({
  render() {
    let list = _.toArray(this.props.data.list);
    let nodes = list.map(function(d) {
      return (
        <Card key={d.item_id}>
          <CardHeader
            title={d.resolved_title}
            subtitle={d.resolved_url}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </CardText>
          <CardActions expandable={true}>
            <FlatButton label="Action1"/>
            <FlatButton label="Action2"/>
          </CardActions>
        </Card>
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
