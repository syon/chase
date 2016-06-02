import React from 'react';
import axios from 'axios';
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
    axios.get('/retrieve')
      .then((response) => {
        this.setState({ list: response.data });
      })
      .catch((response) => {
        console.error('/retrieve', response);
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
