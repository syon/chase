import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import ArchiveButton from './ArchiveButton';

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

    $.ajax({
      url: "/thumbs",
      cache: false,
      timeout: 30000,
      success: (res) => {
        console.log("/thumbs", res);
        this.setState({thumbed: true});
      },
      error: (xhr, status, err) => {
        console.error("/thumbs", status, err.toString());
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
          thumbed={this.props.data.thumbed}
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

const thumbs_path = "https://s3.amazonaws.com/syon-chase/items/thumbs/";

class Item extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.onImgError = this.onImgError.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      isLoadImgError: false
    };
  }

  getTitle(d) {
    let title = d.resolved_title;
    if (!title) {
      title = d.given_url;
    }
    return title;
  }

  onImgError(a,b,c) {
    this.setState({
      isLoadImgError: true
    });
  }

  getOgpImage() {
    let item10_id = ("0000000000"+this.props.uniqId).substr(-10,10);
    let item_id_3 = item10_id.substring(0, 3);
    let emitter = "";
    if (this.props.thumbed && this.state.isLoadImgError) {
      emitter = "?";
    }
    let img_url_s3 = thumbs_path + item_id_3 + "/" + item10_id + ".jpg" + emitter;
    return (
      <div className='ogpimg'>
        <img src={img_url_s3} onError={this.onImgError} />
      </div>
    );
  }

  getUrl(d) {
    let url = d.resolved_url;
    if (!url) {
      url = d.given_url;
    }
    return url;
  }

  getHatebu(url) {
    return (
      <img src={"http://b.hatena.ne.jp/entry/image/" + url} />
    )
  }

  getUpdAt(d) {
    let dt = new Date(d.time_updated * 1000);
    let ymd = [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()];
    return ymd.join('/') + ' ' + dt.toLocaleTimeString();
  }

  getFqdn(d) {
    try {
      let url = this.getUrl(d);
      return (url+"/").match(/\/\/(.*?)\//)[1];
    } catch(e) {
      console.error(e, d);
      return d.given_url;
    }
  }

  handleClick(e,a,b,c) {
    let id = this.props.data.item_id;
    this.props.toggleSelected(id);
  }

  render() {
    let d = this.props.data;

    let title   = this.getTitle(d);
    let ogp_img = this.getOgpImage();
    let url     = this.getUrl(d);
    let hatebu  = this.getHatebu(url);
    let upd_at  = this.getUpdAt(d);
    let fqdn    = this.getFqdn(d);

    let style = {};
    if (this.props.selectedId == d.item_id) {
      style = {backgroundColor: "#F4FF81"};
    }

    return (
      <Paper zDepth={1} rounded={false} className="item" style={style}>
        {ogp_img}
        <div className="item-body" onClick={this.handleClick}>
          <h3 className="item-title">
            <a href={url} target="_blank">{title}</a>
          </h3>
          <div className="item-meta">
            <span className="hatebu">{hatebu}</span>
            <span>{upd_at}</span>
            <span>{fqdn}</span>
          </div>
        </div>
        <ArchiveButton label="Archive" item_id={d.item_id} />
      </Paper>
    );
  }
}

export default ItemBox;
