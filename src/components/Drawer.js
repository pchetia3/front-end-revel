import React from "react";
import { DrawerDialog, IconButton } from "@revel/core";
import { CloseIcon } from "@revel/icons";

class Drawer extends React.Component {
  render() {
    return (
      <DrawerDialog
        isOpen={this.props.opened}
        onClose={this.props.onClose}
        fullWidthForMobile
      >
        <div>
          <IconButton onClick={this.props.onClose}>
            <CloseIcon />
          </IconButton>

          {this.props.children}
        </div>
      </DrawerDialog>
    );
  }
}

export default Drawer;
