import React from "react";
import Paper from "@material-ui/core/Paper";
import ExportButton from "../../components/ExportButton";
import DataTable from "../../components/DataTable";
import { sendRequest } from "../../utils/requests";
import TitleBar from "../../components/TitleBar";
import { format } from "date-fns";
import { withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import Payment from "../../models/Payment";
import OrderCategory from "../../models/OrderCategory";
import Formatter from "../../models/Formatter";
import { Typography } from "@material-ui/core";
import ReportPieChart from "../../components/ReportPieChart";
import { object } from "prop-types";
import Box from "@material-ui/core/Box";

const formatStr = "YYYYMMDD";
const styles = {
  paper: {
    overflow: "auto"
  },
  root: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20
  }
};

class LossPreventionReport extends React.Component {
  state = {
    title: "",
    isLoading: true,
    rowData: [],
    totalData: [],
    graphData: [],
    payType: Payment.all,
    startDate: new Date(),
    endDate: new Date()
  };

  onReceiveData = response => {
    this.estID = this.props.location.search.split("=")[1];
    const employeeData = Formatter.lossPreventionFormatter(
      response.data,
      this.estID,
      this.state.startDate,
      this.state.endDate
    );
    const footerTotalsData = Formatter.totalsFooterFormatter(response.totals);
    let graph = [];
    for (const type in OrderCategory.types) {
      graph = this.fetchGraphData(
        OrderCategory.types[type].title,
        response.data,
        graph
      );
    }

    let newGraphData = graph;

    this.setState({
      rowData: employeeData,
      totalData: footerTotalsData,
      graphData: newGraphData
    });
  };

  fetchGraphData(category, data, graph) {
    let arr = graph;
    arr[category] = [];

    for (let i in data) {
      if (category === "Refunds") {
        arr[category].push({
          name: "Employee " + data[i].employeeId.sum.toString(),
          value: data[i].refundTotal.sum
        });
      } else if (category === "Voids") {
        arr[category].push({
          name: "Employee " + data[i].employeeId.sum.toString(),
          value: data[i].voidTotal.sum
        });
      } else {
        arr[category].push({
          name: "Employee " + data[i].employeeId.sum.toString(),
          value: data[i].discountTotal.sum
        });
      }
    }
    return arr;
  }

  requestHandler = {
    path: "/location",
    error: "Cannot load this location's data.",
    onSuccess: this.onReceiveData,
    config: {
      schema: this.props.profile.schema,
      establishment_id: "",
      current_date: format(new Date(), formatStr),
      payment_type: null
    }
  };

  onSelectDateRange = (start, end) => {
    const startStr = format(start, formatStr);
    const endStr = format(end, formatStr);

    if (startStr === endStr) {
      this.requestHandler.config.current_date = startStr;
      delete this.requestHandler.config.start_date;
      delete this.requestHandler.config.end_date;
    } else {
      this.requestHandler.config.start_date = startStr;
      this.requestHandler.config.end_date = endStr;
      delete this.requestHandler.config.current_date;
    }

    this.setState({
      isLoading: true,
      rowData: [],
      startDate: start,
      endDate: end
    });
    this.refreshDataTable();
  };

  onSelectPayType = newPayType => {
    this.requestHandler.config.payment_type = newPayType.requestTitle;
    this.setState({
      isLoading: true,
      rowData: [],
      payType: newPayType
    });

    this.refreshDataTable();
  };

  componentDidMount() {
    this.requestHandler.config.establishment_id = this.props.location.search.split(
      "="
    )[1];

    this.setState({ title: this.requestHandler.config.establishment_id });

    this.refreshDataTable();
  }

  refreshDataTable() {
    sendRequest(this, this.requestHandler);
  }

  render() {
    const exportRequestHandler = {
      path: "/report",
      error: "Cannot fetch report.",
      onSuccess: null,
      config: this.requestHandler.config
    };

    return (
      <div style={styles.root}>
        <Box display="flex" lexGrow={1} p={1} justifyContent="center" m={1}>
          {OrderCategory.types.map(category => {
            return (
              <Box p={1} flexGrow={1}>
                <Paper>
                  <Box p={1} flexGrow={1} justifyContent="center">
                    <Typography
                      align="center"
                      style={{ marginTop: 20 }}
                      variant="h6"
                    >
                      {category.title}
                    </Typography>
                  </Box>
                  <Box p={1} flexGrow={1} justifyContent="center">
                    <ReportPieChart
                      data={
                        Object.keys(this.state.graphData).length == 0
                          ? []
                          : this.state.graphData[category.title]
                      }
                    />
                  </Box>
                </Paper>
              </Box>
            );
          })}
        </Box>

        <Paper style={styles.paper} elevation={6}>
          <TitleBar
            payType={this.state.payType}
            handlePayType={this.onSelectPayType}
            startD={this.state.startDate}
            endD={this.state.endDate}
            handleDone={this.onSelectDateRange}
            title={"Loss Prevention Report " + this.state.title}
          >
            <ExportButton
              requestHandler={exportRequestHandler}
              align="center"
            />
          </TitleBar>

          <DataTable
            rowData={this.state.rowData}
            header={[
              "Employee ID",
              "Refund Count",
              "Refund Total",
              "Refund Avg",
              "Void Count",
              "Void Total",
              "Discount Count",
              "Discount Total",
              "Discount Avg"
            ]}
            footer={this.state.totalData}
            isLoading={this.state.isLoading}
          />
        </Paper>
      </div>
    );
  }
}

export default withRouter(withSnackbar(LossPreventionReport));
