import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { Link as RouterLink, withRouter } from "react-router-dom";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: "center",
    flexWrap: "wrap"
  },
  paper: {
    padding: theme.spacing(1, 2)
  }
}));

function SimpleBreadcrumbs(props) {
  const classes = useStyles();

  function handleClick(event) {
    props.history.push("/");
  }

  return (
    <div className={classes.root}>
      <Paper elevation={0} className={classes.paper}>
        <Breadcrumbs aria-label="Breadcrumb">
          <Link
            color="inherit"
            component={RouterLink}
            to={"/locations"}
            onClick={handleClick}
          >
            Locations
          </Link>
          <Link
            color="inherit"
            component={RouterLink}
            to={"/reports?establishment_id=" + props.estID}
            onClick={handleClick}
          >
            Establishment {props.estID}
          </Link>

          <Typography color="textPrimary">
            Employee {props.employeeID}
          </Typography>
        </Breadcrumbs>
      </Paper>
    </div>
  );
}

export default withRouter(SimpleBreadcrumbs);
