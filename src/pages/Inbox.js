import React from "react";
import MUIDataTable from "mui-datatables";
import { LoaderWrapper, Typography, Paper, IconButton } from "@revel/core";
import Box from "@material-ui/core/Box";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Divider from "@material-ui/core/Divider";

const styles = {
  root: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20
  }
};

class Inbox extends React.Component {
  state = {
    selectedData: null
  };

  options = {
    responsive: "scroll",
    selectableRows: "none",
    search: true,
    viewColumns: true,
    filter: false,
    print: false,
    download: false,
    rowsPerPageOptions: [5, 10, 25, 50, 100],
    onRowClick: (rowData, rowMeta) => {
      const alert = this.props.alerts[rowMeta.rowIndex];

      const selected = (
        <div>
          <Paper>
            <Box flexDirection="row" fontWeight="fontWeightBold" m={1}>
              <IconButton
                data-sidebar-test-close
                onClick={() => this.setState({ selectedData: null })}
              >
                <ChevronLeftIcon />
              </IconButton>

              <Typography style={{ marginLeft: 10 }} variant="h6">
                {alert.title}
              </Typography>
            </Box>

            <Divider />

            <Divider />

            <div style={{ margin: 20, paddingBottom: 20 }}>
              {alert.body.split("\n").map(item => (
                <Typography>{item}</Typography>
              ))}
              <Link to={alert.link}>View</Link>
            </div>
          </Paper>
        </div>
      );

      this.setState({ selectedData: selected });
    }
  };

  render() {
    const view = this.state.selectedData ? (
      this.state.selectedData
    ) : (
      <MUIDataTable
        title="Inbox"
        data={this.props.alertData}
        columns={["Title", "Threshold Type", "Date"]}
        options={this.options}
      />
    );

    return <div style={styles.root}>{view}</div>;
  }
}

export default Inbox;
