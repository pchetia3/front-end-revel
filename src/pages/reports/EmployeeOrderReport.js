import React from "react";
import { withSnackbar } from "notistack";
import { withRouter } from "react-router-dom";
import DataTable from "../../components/DataTable";
import ExpandPanel from "../../components/ExpandPanel";
import TitleBar from "../../components/TitleBar";
import Paper from "@material-ui/core/Paper";
import { sendRequest } from "../../utils/requests";
import OrderCategory from "../../models/OrderCategory";
import Drawer from "../../components/Drawer";
import { Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Payment from "../../models/Payment";
import BreadCrumb from "../../components/BreadCrumb";
import { format } from "date-fns";
import { formatStr } from "../../constants";
import Box from "@material-ui/core/Box";

class EmployeeOrderReport extends React.Component {
  state = {
    rowData: [],
    isLoadingType: [],
    startDate: null,
    endDate: null,
    payType: Payment.all,
    selectedOrder: null,
    expanded: []
  };
  createRequestHandler(orderCategory) {
    const name = orderCategory.title.toLowerCase();

    return {
      path: "/employee",
      error: "Cannot load " + name + " data.",
      onSuccess: response => this.onReceiveData(orderCategory, response),
      config: {
        schema: this.props.profile.schema,
        employee_id: this.employeeID,
        current_date: format(new Date(), formatStr),
        action_type: name,
        cursor: null,
        payment_type: null
      }
    };
  }

  onSelectOrder = (category, id, order) => {
    this.setState({
      selectedOrder: {
        title: "Order " + id,
        header: category.itemHeader,
        rowData: category.itemFormatter(order.items)
      }
    });
  };

  emptyData = () => {
    const clearedRowData = this.state.rowData;

    for (const row in clearedRowData) {
      clearedRowData[row] = [];
    }

    return clearedRowData;
  };

  toggledLoading = () => {
    const newLoading = this.state.isLoadingType;

    for (const i in this.state.expanded) {
      const title = this.state.expanded[i];
      newLoading[title] = !newLoading[title];
    }

    return newLoading;
  };

  refreshExpanded() {
    for (const i in this.state.expanded) {
      sendRequest(this, this.requestHandlers[this.state.expanded[i]]);
    }
  }

  onSelectPayCategory = newPayment => {
    // clear data, toggle loading as new request must be made
    this.setState({
      rowData: this.emptyData(),
      payType: newPayment,
      isLoadingType: this.toggledLoading()
    });

    // update all request handlers the new payment type
    for (const key in this.requestHandlers) {
      this.requestHandlers[key].config.payment_type = newPayment.requestTitle;
      this.requestHandlers[key].cursor = null;
    }

    // send new request for expanded items
    this.refreshExpanded();
  };

  onSelectDateRange = (start, end) => {
    // clear data, toggle loading, update start/end date
    this.setState({
      rowData: this.emptyData(),
      isLoadingType: this.toggledLoading(),
      startDate: start,
      endDate: end
    });

    // update all request handlers for the new start/end date
    const startStr = format(start, formatStr);
    const endStr = format(end, formatStr);

    for (let key in this.requestHandlers) {
      const current = this.requestHandlers[key];

      if (startStr === endStr) {
        current.config.current_date = startStr;
        delete current.config.start_date;
        delete current.config.end_date;
      } else {
        current.config.start_date = startStr;
        current.config.end_date = endStr;
        delete current.config.current_date;
      }

      current.config.cursor = null;
    }

    // send new request
    this.refreshExpanded();
  };

  onReceiveData(orderCategory, response) {
    const title = orderCategory.title;

    const newRow = this.state.rowData;
    newRow[title] = newRow[title].concat(
      orderCategory.formatter(this.onSelectOrder, response.data)
    );

    const newLoading = this.state.isLoadingType;
    newLoading[title] = !newLoading[title];

    this.setState({
      rowData: newRow,
      isLoadingType: newLoading
    });

    this.requestHandlers[title].config.cursor = response.cursor;
    if (response.cursor !== null) {
      sendRequest(this, this.requestHandlers[title]);
    }
  }

  onExpand = (expanded, category) => {
    if (expanded) {
      // clear out previous data and send new request
      this.state.rowData[category] = [];
      this.state.expanded.push(category);
      this.setState(state => ({
        rowData: state.rowData,
        expanded: state.expanded
      }));

      sendRequest(this, this.requestHandlers[category]);
    } else {
      const newRowData = this.state.rowData;
      newRowData[category] = [];
      const newExpanded = this.state.expanded.filter(v => category !== v);

      const newLoading = this.state.isLoadingType;
      newLoading[category] = !newLoading[category];

      this.setState({
        rowData: newRowData,
        expanded: newExpanded,
        isLoadingType: newLoading
      });
    }
  };

  componentWillMount() {
    this.estID = this.props.location.search
      .split("?")[1]
      .split("&")[0]
      .split("=")[1];
    this.employeeID = this.props.location.search.split("&")[1].split("=")[1];

    this.requestHandlers = [];

    OrderCategory.types.forEach(type => {
      this.requestHandlers[type.title] = this.createRequestHandler(type);
    });

    if (this.props.location.state && this.props.location.state.clicked) {
      this.onExpand(true, this.props.location.state.openCategory);
    }

    if (
      this.props.location.state &&
      this.props.location.state.startDate &&
      this.props.location.state.endDate
    ) {
      const start = this.props.location.state.startDate;
      const end = this.props.location.state.endDate;
      this.onSelectDateRange(start, end);

      this.setState({ startDate: start, endDate: end });
    } else {
      this.setState({ startDate: new Date(), endDate: new Date() });
    }
  }

  onCloseDrawer = () => {
    this.setState({ selectedOrder: null });
  };

  render() {
    return (
      <div style={{ margin: 20 }}>
        <Drawer
          onClose={this.onCloseDrawer}
          opened={this.state.selectedOrder != null}
        >
          {this.state.selectedOrder && (
            <div>
              <Typography style={{ marginLeft: 10 }} variant="h6">
                {this.state.selectedOrder.title}
              </Typography>
              <Divider />
              <DataTable
                isLoading={false}
                header={this.state.selectedOrder.header}
                rowData={this.state.selectedOrder.rowData}
              />
            </div>
          )}
        </Drawer>

        <Paper elevation={6}>
          <TitleBar
            payType={this.state.payType}
            handlePayType={this.onSelectPayCategory}
            startD={this.state.startDate}
            endD={this.state.endDate}
            handleDone={this.onSelectDateRange}
            title={`Employee ${this.employeeID}`}
          />
          <BreadCrumb estID={this.estID} employeeID={this.employeeID} />

          {OrderCategory.types.map((category, index) => {
            const header = category.orderHeader;

            return (
              <ExpandPanel
                expanded={this.state.expanded.includes(category.title)}
                title={category.title}
                onClick={expanded => this.onExpand(expanded, category.title)}
              >
                <DataTable
                  header={header}
                  rowData={this.state.rowData[category.title]}
                  isLoading={!this.state.isLoadingType[category.title]}
                />
              </ExpandPanel>
            );
          })}
        </Paper>
      </div>
    );
  }
}

export default withRouter(withSnackbar(EmployeeOrderReport));
