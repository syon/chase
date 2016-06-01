import React from 'react';
import $ from 'jquery';
import ItemList from './ItemList';

class ItemBox extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      thumbed: false,
      list: [],
    };
  }

  componentDidMount() {
    this.loadFromServer();
  }

  loadFromServer() {
    $.ajax({
      url: '/retrieve',
      dataType: 'json',
      cache: false,
      success: (list) => {
        console.log("/retrieve", list);
        this.setState({ list });
      },
      error: (xhr, status, err) => {
        console.error("/retrieve", status, err.toString());
      },
    });
  }

  render() {
    const styles = {
      itemBox: {
        maxWidth: 800,
        margin: '15px auto',
      },
    };
    return (
      <div className="itemBox" style={styles.itemBox}>
        <ItemList data={this.state} />
      </div>
    );
  }
}

export default ItemBox;
