import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import _ from 'lodash';
import {
  AppBar,
  Card, CardActions, CardHeader, CardText,
  FlatButton, RaisedButton
} from 'material-ui';
// import CardExampleWithAvatar from 'mycomponents/CardExampleWithAvatar';
// import CardExampleWithoutAvatar from './mycomponents/CardExampleWithoutAvatar.jsx';
import Abc from './Abc.jsx';

let App = React.createClass({
  render: () => {
    return (
      <div>
        <AppBar
          title="Pokke"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('title')
);

let ItemBox = React.createClass({
  loadFromServer: function() {
    $.ajax({
      url: "/retrieve",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/retrieve", status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: {list: []}};
  },
  componentDidMount: function() {
    this.loadFromServer();
  },
  render: function() {
    return (
      <div className="itemBox">
        <ItemList data={this.state.data} />
      </div>
    );
  }
});

let ItemList = React.createClass({
  render: function() {
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

ReactDOM.render(
  <ItemBox />,
  document.getElementById('itembox')
);
