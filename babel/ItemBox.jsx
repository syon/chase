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
      let title = d.resolved_title;
      if (!title) {
        title = d.given_url;
      }
      let img;
      if (d.image) {
        img = <img src={d.image.src}/>;
      } else {
        img = <img src="/img/blank.png"/>;
      }
      let fqdn = (() => {
        try {
          let url = d.resolved_url;
          if (!url) {
            url = d.given_url;
          }
          return (url+"/").match(/\/\/(.*?)\//)[1];
        } catch(e) {
          console.error(e, d);
          return d.given_url;
        }
      })();
      let upd_at = (() => {
        let dt = new Date(d.time_updated * 1000);
        let ymd = [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()];
        return ymd.join('/') + ' ' + dt.toLocaleTimeString();
      })();
      nodes.push(
        <Paper key={d.item_id} zDepth={1} rounded={false} className="item">
          {img}
          <div className="item-body">
            <div className="item-title">
              <a href={d.resolved_url} target="_blank">{title}</a>
            </div>
            <div className="item-meta">
              <span>{upd_at}</span>
              <span>{fqdn}</span>
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
