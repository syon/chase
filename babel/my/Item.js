import React from 'react';
import $ from 'jquery';
import Paper from 'material-ui/Paper';
import ArchiveButton from './ArchiveButton';
import { grey200 } from 'material-ui/styles/colors';

const thumbsPath = 'https://s3.amazonaws.com/syon-chase/items/thumbs/';

const propTypes = {
  data: React.PropTypes.object,
  uniqId: React.PropTypes.string,
  selectedId: React.PropTypes.string,
  toggleSelected: React.PropTypes.func,
};

class Item extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.onImgError = this.onImgError.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleArchive = this.handleArchive.bind(this);

    this.state = {
      imageReloaded: false,
      archived: false,
    };
  }

  onImgError() {
    $.ajax({
      type: 'POST',
      url: '/thumbnail',
      dataType: 'json',
      data: this.props.data,
      cache: false,
      success: (result) => {
        console.log("/thumbnail", result);
        this.setState({
          imageReloaded: true,
        });
      },
      error: (xhr, status, err) => {
        console.error("/thumbnail", status, err.toString());
      },
    });
  }

  getTitle(d) {
    let title = d.resolved_title;
    if (!title) {
      title = d.given_url;
    }
    return title;
  }

  getOgpImage() {
    const item10Id = `0000000000${this.props.uniqId}`.substr(-10, 10);
    const itemId3 = item10Id.substring(0, 3);
    let emitter = '';
    if (this.state.imageReloaded) {
      emitter = '?';
    }
    const imgUrlS3 = `${thumbsPath}${itemId3}/${item10Id}.jpg${emitter}`;
    return (
      <div className="ogpimg">
        <img src={imgUrlS3} onError={this.onImgError} role="presentation" />
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
      <img src={`http://b.hatena.ne.jp/entry/image/${url}`} role="presentation" />
    );
  }

  getUpdAt(d) {
    const dt = new Date(d.time_updated * 1000);
    const ymd = [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()];
    return ymd.join('.');
  }

  getFqdn(d) {
    try {
      const url = this.getUrl(d);
      return `${url}/`.match(/\/\/(.*?)\//)[1];
    } catch (e) {
      console.error(e, d);
      return d.given_url;
    }
  }

  handleClick() {
    const id = this.props.data.item_id;
    this.props.toggleSelected(id);
  }

  handleArchive() {
    this.setState({ archived: true });
  }

  render() {
    const d = this.props.data;

    let title  = this.getTitle(d);
    let ogpImg = this.getOgpImage();
    let url    = this.getUrl(d);
    let hatebu = this.getHatebu(url);
    let updAt  = this.getUpdAt(d);
    let fqdn   = this.getFqdn(d);

    let style = {};
    if (this.props.selectedId === d.item_id) {
      style = { backgroundColor: '#F4FF81' };
    }
    if (this.state.archived) {
      style = { backgroundColor: grey200 };
    }

    return (
      <Paper zDepth={1} rounded={false} className="item" style={style}>
        {ogpImg}
        <div className="item-body" onClick={this.handleClick}>
          <h3 className="item-title">
            <a href={url} target="_blank">{title}</a>
          </h3>
          <div className="item-meta">
            <span className="hatebu">{hatebu}</span>
            <span className="upd_at">{updAt}</span>
            <span className="fqdn">{fqdn}</span>
          </div>
        </div>
        <ArchiveButton label="Archive" itemId={d.item_id} handleArchive={this.handleArchive} />
      </Paper>
    );
  }
}

Item.propTypes = propTypes;

export default Item;
