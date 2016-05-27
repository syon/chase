import React from 'react';
import $ from 'jquery';
import Paper from 'material-ui/Paper';
import ArchiveButton from './ArchiveButton';

const thumbs_path = "https://s3.amazonaws.com/syon-chase/items/thumbs/";

class Item extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.onImgError = this.onImgError.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      imageReloaded: false
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
    $.ajax({
      type: "POST",
      url: "/thumbnail",
      dataType: 'json',
      data: this.props.data,
      cache: false,
      success: (result) => {
        console.log("/thumbnail", result);
        this.setState({
          imageReloaded: true
        });
      },
      error: (xhr, status, err) => {
        console.error("/thumbnail", status, err.toString());
      }
    });
  }

  getOgpImage() {
    let item10_id = ("0000000000"+this.props.uniqId).substr(-10,10);
    let item_id_3 = item10_id.substring(0, 3);
    let emitter = "";
    if (this.state.imageReloaded) {
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

export default Item;
