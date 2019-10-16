import React from "react";
import WarningIcon from "@material-ui/icons/WarningOutlined";

function WarningIndicator() {
  return (
    <WarningIcon
      style={{
        verticalAlign: "bottom",
        color: "#D50300",
        width: 16
      }}
      color="error"
    />
  );
}

export default WarningIndicator;
