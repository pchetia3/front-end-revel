import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

/**
 * Create a stackable Snackbar with an dismiss button, essentially a wrapper for notistack
 *
 * @props snackbar the handler for sending the snackbar passed by the component's props
 * @param message the message to provide
 * @param variant the type of Snackbar ("error", "warning", "success", "info")
 */
export const send = (handler, message, variant) => {
  const action = key => (
    <IconButton
      color="inherit"
      onClick={() => {
        handler.closeSnackbar(key);
      }}
    >
      <CloseIcon />
    </IconButton>
  );

  handler.enqueueSnackbar(message, { action, variant: variant });
};
