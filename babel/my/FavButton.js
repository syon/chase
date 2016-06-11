import React from 'react';
import axios from 'axios';
import IconButton from 'material-ui/IconButton';
import Star from 'material-ui/svg-icons/toggle/star';
import { yellowA700, grey300 } from 'material-ui/styles/colors';
import RefreshIndicator from 'material-ui/RefreshIndicator';

const propTypes = {
  itemId: React.PropTypes.string,
  favorite: React.PropTypes.string,
  handleClick: React.PropTypes.func,
  sendFav: React.PropTypes.func,
  sendUnfav: React.PropTypes.func,
};

class FavButton extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
    this.sendFav = this.sendFav.bind(this);
    this.sendUnfav = this.sendUnfav.bind(this);

    const isFav = this.props.favorite === '1';
    this.state = {
      label: (isFav ? 'Unfavorite' : 'Favorite'),
      isFav,
      icon: this.getFavIcon(isFav),
    };
  }

  getFavIcon(isFav) {
    return isFav ? <Star color={yellowA700} /> : <Star color={grey300} />;
  }

  getIngIcon() {
    return (
      <RefreshIndicator
        size={24}
        left={12}
        top={12}
        status="loading"
      />);
  }

  handleClick() {
    if (this.state.isFav) {
      this.sendUnfav();
    } else {
      this.sendFav();
    }
  }

  sendFav() {
    this.setState({
      icon: this.getIngIcon(),
    });
    axios.post('/fav', { item_id: this.props.itemId })
      .then(() => {
        this.setState({
          label: 'Unfavorite',
          isFav: true,
          icon: this.getFavIcon(true),
        });
      })
      .catch((response) => {
        console.error('/fav', response);
      });
  }

  sendUnfav() {
    this.setState({
      icon: this.getIngIcon(),
    });
    axios.post('/unfav', { item_id: this.props.itemId })
      .then(() => {
        this.setState({
          label: 'Favorite',
          isFav: false,
          icon: this.getFavIcon(false),
        });
      })
      .catch((response) => {
        console.error('/unfav', response);
      });
  }

  render() {
    return (
      <IconButton
        className="btn-fav"
        tooltip={this.state.label}
        label={this.state.label}
        onClick={this.handleClick}
      >
        {this.state.icon}
      </IconButton>
    );
  }
}

FavButton.propTypes = propTypes;

export default FavButton;
