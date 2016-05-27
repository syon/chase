import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import Item from './Item';

class ItemBox extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      thumbed: false,
      list: []
    };
  }

  loadFromServer() {
    $.ajax({
      url: "/retrieve",
      dataType: 'json',
      cache: false,
      success: (list) => {
        console.log("/retrieve", list);
        this.setState({list: list});
      },
      error: (xhr, status, err) => {
        console.error("/retrieve", status, err.toString());
      }
    });
  }

  componentDidMount() {
    this.loadFromServer();
  }

  render() {
    let styles = {
      itemBox: {
        maxWidth: 800,
        margin: "15px auto"
      }
    }
    return (
      <div className="itemBox" style={styles.itemBox}>
        <ItemList data={this.state} />
      </div>
    );
  }
}

class ItemList extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.toggleSelected = this.toggleSelected.bind(this);

    this.state = {
      selectedId: ""
    };
  }

  getItemId(d) {
    let id = d.resolved_id;
    if (id == "0") {
      id = d.item_id;
    }
    return id;
  }

  toggleSelected(item_id) {
    this.setState({selectedId: item_id})
  }

  render() {
    let list = _.toArray(this.props.data.list);
    let nodes = [];

    _.each(list, (d) => {
      nodes.push(
        <Item
          key={this.getItemId(d)}
          uniqId={this.getItemId(d)}
          data={d}
          selectedId={this.state.selectedId}
          toggleSelected={this.toggleSelected}
        />
      );
    });

    return (
      <div className="itemList">
        {nodes}
      </div>
    );
  }
}

export default ItemBox;
