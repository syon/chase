import React from 'react';
import axios from 'axios';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';
import RefreshIndicator from 'material-ui/RefreshIndicator';

const propTypes = {
  label: React.PropTypes.string,
  itemId: React.PropTypes.string,
  handleArchive: React.PropTypes.func,
};


class ArchiveButton extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.getIcon = this.getIcon.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      disabled: false,
      icon: this.getIcon(),
    };
  }

  getIcon() {
    return <ActionDone color={this.context.muiTheme.palette.primary1Color} />;
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
    this.setState({
      icon: this.getIngIcon(),
    });
    axios.post('/archive', { item_id: this.props.itemId })
      .then(() => {
        this.setState({
          disabled: true,
          icon: this.getIcon(),
        });
        this.props.handleArchive();
      })
      .catch((response) => {
        console.error('/archive', response);
      });
  }

  render() {
    return (
      <IconButton
        tooltip="Archive"
        label={this.props.label}
        onClick={this.handleClick}
        disabled={this.state.disabled}
      >
        {this.state.icon}
      </IconButton>
    );
  }
}

ArchiveButton.propTypes = propTypes;
ArchiveButton.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
};

export default ArchiveButton;
