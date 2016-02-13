import React from 'react';
import $ from 'jquery';
import RaisedButton from 'material-ui/lib/raised-button';

const ArchiveButton = React.createClass({

  getInitialState() {
    return {disabled: false};
  },

  handleClick(event) {
    console.log("Archiving...", this.props.item_id);
    $.ajax({
      type: "POST",
      url: "/archive",
      dataType: 'json',
      cache: false,
      data: {item_id: this.props.item_id},
      success: (list) => {
        console.log("Success.");
        this.setState({disabled: true});
      },
      error: (xhr, status, err) => {
        console.error("/archive", xhr, status, err.toString());
      }
    });
  },

  render() {
    return (
      <RaisedButton
        label={this.props.label}
        onClick={this.handleClick}
        disabled={this.state.disabled}
      />
    );
  }

});

export default ArchiveButton;
