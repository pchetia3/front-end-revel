import { LoaderWrapper, TableCell, TableRow } from "@revel/core";
import React from "react";
import TableFooter from "@material-ui/core/TableFooter";
import MUIDataTable from "mui-datatables";
import TablePagination from "@material-ui/core/TablePagination";
import { string } from "prop-types";

class DataTable extends React.PureComponent {
  state = {
    page: 0,
    rowsPerPage: 25
  };

  dataToTableBody = () => {
    const rowData = this.props.rowData;

    if (!rowData) {
      return;
    }

    return rowData.map((row, rowIndex) => (
      <TableRow key={rowIndex}>
        {Object.keys(row).map((col, colIndex) => (
          <TableCell key={colIndex} align="left">
            {row[col]}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: parseInt(event.target.value), page: 0 });
  };

  formatNumber(num) {
    if (typeof num !== "string" && typeof num.props.children !== "string") {
      num = num.props.children.props.children;
    } else if (typeof num !== "string") {
      num = num.props.children;
    }
    if (num.length > 6) {
      num = num.replace(",", "");
    }
    return num[0] === "$"
      ? parseFloat(num.substring(1, num.length))
      : parseFloat(num);
  }
  formatDate(date) {
    let num1 = date.split(" ")[0].split("/");
    let a = num1[0];
    num1[0] = num1[1];
    num1[1] = a;

    num1 = num1.reverse().join("");

    let num2 = date
      .split(" ")[1]
      .split(":")
      .join("");
    return num1 + num2;
  }

  render() {
    let options = {
      responsive: "scroll",
      selectableRows: "none",
      elevation: 0,
      search: false,
      print: false,
      download: false,
      viewColumns: false,
      filter: false,
      rowsPerPageOptions: [5, 10, 25, 50, 100],
      onChangePage: (event, page) => this.setState({ page: page }),
      onChangeRowsPerPage: this.handleChangeRowsPerPage,
      customSort: (data, colIndex, order) => {
        return data.sort((a, b) => {
          a = a.data[colIndex];
          b = b.data[colIndex];

          if (colIndex === 6) {
            a = this.formatNumber(a.props.children[1]);
            b = this.formatNumber(b.props.children[1]);
          } else if (colIndex === 0) {
            if (typeof a === "number") {
              a = this.formatNumber(a.toString());
              b = this.formatNumber(b.toString());
            } else {
              a = this.formatNumber(a.props.children.props.children[2]);
              b = this.formatNumber(b.props.children.props.children[2]);
            }
          } else if (colIndex === 1 && typeof a === "string") {
            a = this.formatNumber(this.formatDate(a));
            b = this.formatNumber(this.formatDate(b));
          } else {
            a = this.formatNumber(a);
            b = this.formatNumber(b);
          }

          return (a < b ? -1 : 1) * (order === "desc" ? 1 : -1);
        });
      }
    };

    const { page, rowsPerPage } = this.state;

    const data = this.props.rowData;
    let filtered = typeof data === "undefined" ? [] : data;
    const startIndex = page * rowsPerPage;
    const endIndex = page * rowsPerPage + rowsPerPage;
    filtered = filtered.slice(startIndex, endIndex);

    options.rowsPerPage = this.state.rowsPerPage;
    options.page = this.state.page;
    options.count =
      typeof this.props.rowData === "undefined" ? 0 : this.props.rowData.length;

    options.customFooter = () => {
      return (
        <TableFooter>
          {this.props.footer && <TableRow>{this.props.footer}</TableRow>}
          <TablePagination
            rowsPerPageOptions={options.rowsPerPageOptions}
            count={options.count}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={options.onChangePage}
            onChangeRowsPerPage={options.onChangeRowsPerPage}
          />
        </TableFooter>
      );
    };

    return (
      <div>
        <LoaderWrapper isLoading={this.props.isLoading}>
          <MUIDataTable
            data={filtered}
            columns={this.props.header}
            options={options}
          />
        </LoaderWrapper>
      </div>
    );
  }
}

export default DataTable;
