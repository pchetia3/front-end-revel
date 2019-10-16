import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

class ExpandPanel extends React.Component {
  onClickExpand(expanded) {
    this.props.onClick(expanded);
  }

  render() {
    return (
      <ExpansionPanel
        expanded={this.props.expanded}
        onChange={(event, expanded) => this.onClickExpand(expanded)}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{this.props.title}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>{this.props.children}</ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default ExpandPanel;
