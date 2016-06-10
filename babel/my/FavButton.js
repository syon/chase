import React from 'react';
import axios from 'axios';
import IconButton from 'material-ui/IconButton';
import Star from 'material-ui/svg-icons/toggle/star';
import { yellowA700, grey300 } from 'material-ui/styles/colors';

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
      icon: this.getIcon(isFav),
    };
  }

  getIcon(isFav) {
    return isFav ? <Star color={yellowA700} /> : <Star color={grey300} />;
  }

  handleClick() {
    if (this.state.isFav) {
      this.sendUnfav();
    } else {
      this.sendFav();
    }
  }

  sendFav() {
    axios.post('/fav', { item_id: this.props.itemId })
      .then(() => {
        this.setState({
          label: 'Unfavorite',
          isFav: true,
          icon: this.getIcon(true),
        });
      })
      .catch((response) => {
        console.error('/fav', response);
      });
  }

  sendUnfav() {
    axios.post('/unfav', { item_id: this.props.itemId })
      .then(() => {
        this.setState({
          label: 'Favorite',
          isFav: false,
          icon: this.getIcon(false),
        });
      })
      .catch((response) => {
        console.error('/unfav', response);
      });
  }

  render() {
    return (
      <IconButton
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
