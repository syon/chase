import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import {Paper, FlatButton} from 'material-ui';
import ArchiveButton from './ArchiveButton.jsx';

const ItemBox = React.createClass({
  loadFromServer() {
    $.ajax({
      url: "/retrieve",
      dataType: 'json',
      cache: false,
      success: (list) => {
        console.log("/retrieve", list);
        this.setState({data: {list: list}});
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
    let nodes = [];
    _.each(list, (d) => {
      let img;
      if (d.image) {
        img = <img src={d.image.src}/>;
      } else {
        img = <img src="http://lorempixel.com/300/300/nature/"/>;
      }
      let upd_at = (() => {
        let dt = new Date(d.time_updated * 1000);
        let ymd = [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()];
        return ymd.join('/') + ' ' + dt.toLocaleTimeString();
      })();
      nodes.push(
        <Paper key={d.item_id} zDepth={1} rounded={false} className="item">
          {img}
          <div className="item-body">
            <div className="item-title">{d.resolved_title}</div>
            <a href={d.resolved_url} target="_blank">{d.resolved_url}</a>
            <div>
              <span className="item-updat">{upd_at}</span>
            </div>
          </div>
          <ArchiveButton label="Archive" item_id={d.item_id} />
        </Paper>
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
