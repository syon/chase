import React from 'react';
import $ from 'jquery';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';
import { cyan500 } from 'material-ui/styles/colors';

const propTypes = {
  label: React.PropTypes.string,
  itemId: React.PropTypes.string,
  handleArchive: React.PropTypes.func,
};

class ArchiveButton extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      disabled: false,
    };
  }

  handleClick() {
    $.ajax({
      type: 'POST',
      url: '/archive',
      dataType: 'json',
      cache: false,
      timeout: 10000,
      data: { item_id: this.props.itemId },
      success: () => {
        this.setState({ disabled: true });
        this.props.handleArchive();
      },
      error: (xhr, status, err) => {
        console.error('/archive', xhr, status, err.toString());
      },
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
        <ActionDone color={cyan500} />
      </IconButton>
    );
  }
}

ArchiveButton.propTypes = propTypes;

export default ArchiveButton;
