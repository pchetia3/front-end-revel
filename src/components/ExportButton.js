import React from "react";
import { IconButtonWithMenu } from "@revel/core";
import { DescriptionIcon } from "@revel/icons";
import { withSnackbar } from "notistack";
import { send } from "../utils/snackbar";
import { sendRequest } from "../utils/requests";

class ExportButton extends React.Component {
  showSnackbar(format) {
    send(this.props, "Exported to " + format, "success");
  }

  onReceiveData = response => {
    this.showSnackbar("CSV");
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "LocationData.csv");
    document.body.appendChild(link);
    link.click();
  };

  render() {
    if (this.props.requestHandler) {
      this.props.requestHandler.onSuccess = this.onReceiveData;
    }

    return (
      <IconButtonWithMenu
        Icon={DescriptionIcon}
        options={[
          {
            key: "csv",
            label: "Export to CSV",
            onClick: () => {
              sendRequest(this, this.props.requestHandler);
            }
          }
        ]}
      />
    );
  }
}

export default withSnackbar(ExportButton);
