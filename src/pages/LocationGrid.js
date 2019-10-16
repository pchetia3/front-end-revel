import React from "react";
import { CircularProgress } from "@revel/core";
import { withSnackbar } from "notistack";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core";
import { fade } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import ListSubheader from "@material-ui/core/ListSubheader";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { ReactComponent as SearchSVG } from "../icons/search.svg";
import { sendRequest } from "../utils/requests";
import WarningIndicator from "../components/WarningIndicator";
import Grid from "@material-ui/core/Grid";
import { formatStr } from "../constants";
import { format } from "date-fns";

const styles = {
  root: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20
  }
};

const classes = makeStyles(theme => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "500px",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "black"
  },
  inputRoot: {
    color: "black"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 800
    }
  }
}));

class LocationGrid extends React.Component {
  state = {
    search: {
      filtered: [],
      isSearching: false
    },

    locations: [],
    isLoading: true
  };

  onReceiveData = response => {
    this.setState({
      locations: Object.keys(response.data),
      rowData: response.data
    });
  };

  requestHandler = {
    path: "/locations",
    error: "Cannot load locations list.",
    onSuccess: this.onReceiveData,
    config: {
      schema: this.props.profile.schema,
      current_date: format(new Date(), formatStr)
    }
  };

  componentDidMount() {
    sendRequest(this, this.requestHandler);
  }

  onSearchChange = event => {
    const text = event.target.value;

    if (text === "") {
      this.setState({ search: { isSearching: false, filtered: [] } });
    } else {
      const sortedFilter = [];

      this.state.locations.forEach(item => {
        if (item.startsWith(text)) {
          // put in front
          sortedFilter.unshift(item);
        } else if (item.includes(text)) {
          // put in back
          sortedFilter.push(item);
        }
      });

      this.setState({
        search: {
          isSearching: true,
          filtered: sortedFilter
        }
      });
    }
  };

  createList() {
    const searchArray = this.state.search.isSearching
      ? this.state.search.filtered
      : this.state.locations;
    const cols = searchArray.length < 5 ? searchArray.length : 5;
    const resultsError =
      searchArray.length === 0 ? (
        <Typography>No results found.</Typography>
      ) : (
        ""
      );

    return (
      <div>
        <div className={classes.search}>
          <SearchSVG style={{ verticalAlign: "middle" }} />
          <InputBase
            style={{ marginLeft: 8, width: 500 }}
            onChange={this.onSearchChange}
            placeholder="Search establishments..."
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
          />
        </div>

        {resultsError}
        <GridList cellHeight={75} spacing={-15} cols={cols}>
          {searchArray.map(id => (
            <GridListTile key={id}>
              <ListSubheader component="div">
                <Button
                  style={{
                    background: this.state.rowData[id] ? "#D50300" : "#4FBBD5",
                    color: "white"
                  }}
                  fullWidth={true}
                  variant="contained"
                  component={Link}
                  to={"/reports?establishment_id=" + id}
                >
                  {id}
                </Button>
              </ListSubheader>
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }

  render() {
    let listComponent = this.state.isLoading ? (
      <CircularProgress style={{ marginTop: 60 }} />
    ) : (
      this.createList()
    );

    return <div styles={styles.root}>{listComponent}</div>;
  }
}

export default withSnackbar(LocationGrid);
