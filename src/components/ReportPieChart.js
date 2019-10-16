import React from "react";
import { Cell, Pie, PieChart } from "recharts";
import Sector from "recharts/es6/shape/Sector";

class ReportPieChart extends React.Component {
  state = {
    activeIndex: 0
  };

  renderActiveShape = props => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 10) * cos;
    const my = cy + (outerRadius + 10) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`${(percent * 100).toFixed(2)}%`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={20}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`$${value.toFixed(2)}`}
        </text>
      </g>
    );
  };

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index
    });
  };

  render() {
    let COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    if (this.props.data.length % 2 !== 0) {
      COLORS.push("#f54269");
    }

    return (
      <PieChart width={400} height={250}>
        <Pie
          activeIndex={this.state.activeIndex}
          onMouseEnter={this.onPieEnter}
          activeShape={this.renderActiveShape}
          data={this.props && this.props.data ? this.props.data : []}
          cx={200}
          cy={125}
          innerRadius={60}
          outerRadius={80}
          labelLine={false}
          label={() => {}}
          fill="#8884d8"
          dataKey="value"
        >
          {this.props.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    );
  }
}

export default ReportPieChart;
