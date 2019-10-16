import React from "react";
import Button from "@material-ui/core/Button";
import { withSnackbar } from "notistack";
import { send } from "../utils/snackbar";

function SaveButton(props) {
  function callSnackBar() {
    send(props, props.message, "success");
  }

  return (
    <Button
      style={{
        position: "relative",
        bottom: 10,
        left: "92%",
        backgroundColor: "#4FBBD5"
      }}
      variant="contained"
      color="primary"
      onClick={callSnackBar}
    >
      Save
    </Button>
  );
}

export default withSnackbar(SaveButton);
