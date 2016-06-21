import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import SyncDisabled from 'material-ui/svg-icons/notification/sync-disabled';
import OpenInNew from 'material-ui/svg-icons/action/open-in-new';

function TopBar() {
  return (
    <AppBar
      title="Chase"
      showMenuIconButton={false}
      iconElementRight={
        <IconMenu
          iconButtonElement={
            <IconButton><MoreVertIcon /></IconButton>
          }
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <MenuItem
            primaryText="Pocket"
            leftIcon={<OpenInNew />}
            onTouchTap={() => window.open('https://getpocket.com')}
          />
          <MenuItem
            primaryText="Disconnect"
            leftIcon={<SyncDisabled />}
            onTouchTap={() => (window.location = '/disconnect')}
          />
        </IconMenu>
      }
    />
  );
}

export default TopBar;
