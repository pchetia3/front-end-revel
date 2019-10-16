import React from "react";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import ButtonGroup from "@material-ui/core/ButtonGroup";

function SimplePopover(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleDone() {
    setAnchorEl(null);
    props.handleDone();
  }

  function handleCancel() {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);
  const id = props.open ? "simple-popover" : null;

  return (
    <div>
      <Button
        style={{ marginLeft: -10 }}
        aria-describedby={id}
        onClick={handleClick}
      >
        {props.buttonIcon}
        {props.buttonLabel}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCancel}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
      >
        <Grid container direction="column">
          <Grid item xs={3}>
            {props.children}
          </Grid>

          <Grid
            container
            style={{ marginLeft: 10, marginBottom: 10 }}
            spacing={1}
            direction="column"
          >
            <Grid item>
              <ButtonGroup variant="contained" size="small">
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleDone}>Done</Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Grid>
      </Popover>
    </div>
  );
}

export default SimplePopover;
