import React, { Component } from 'react';
import NumberDisplay from './NumberDisplay'
import {Doughnut, Line} from 'react-chartjs-2';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/utils';
import { WidthProvider, Responsive } from "react-grid-layout";
import colors from '../styles/colors';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const layoutname = 'overview-layout';
let originalLayouts = getFromLocalStorage(layoutname, 'layouts') || {};

export default class Overview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layouts: JSON.parse(JSON.stringify(originalLayouts))
    };
  }

  static get defaultProps() {
    return {
      className: "layout",
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      rowHeight: 30
    }
  };

  onLayoutChange(layout, layouts) {
    saveToLocalStorage(layoutname, 'layouts', layouts);
    this.setState({ layouts: layouts });
  }

  componentWillMount() {
    originalLayouts = getFromLocalStorage(layoutname, 'layouts') || [];
    this.setState({ layouts: JSON.parse(JSON.stringify(originalLayouts)) });
  }

  render() {
    return (
      <div className="app-page">
        <h2>Team Project Name</h2>
        <ResponsiveReactGridLayout
          className="layout"
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          layouts={this.state.layouts}
          onLayoutChange={(layout, layouts) =>
            this.onLayoutChange(layout, layouts)
          }
        >
          <div className='box' key="1" data-grid={{ w: 2, h: 5, x: 0, y: 0, minW: 0, minH: 0 }}>
            <NumberDisplay number="43" statistic="Total Commits"/>
          </div>
          <div className='box' key="2" data-grid={{ w: 3, h: 5, x: 2, y: 0, minW: 0, minH: 0 }}>
            <div className="chart chart-pie">
            <span className="chart-title">Technologies Used</span>
            <Doughnut data={technologiesUsed} options={{maintainAspectRatio: true, responsive: true}}/>
            </div>
          </div>
          <div className='box' key="3" data-grid={{ w: 5, h: 7, x: 5, y: 0, minW: 0, minH: 0 }}>
            <div className="chart chart-horizontal-primary">
              <span className="chart-title">Github Contributions</span>
            <Line data={gitContributionsData} options={{maintainAspectRatio: true, responsive: true}}/>
            </div>
          </div>

        </ResponsiveReactGridLayout>
      </div>
    )
  }
}

let technologiesUsed = {
  labels: ["ReactJS", "Python", "HTML"],
  datasets: [{
    label: 'Technologies Used',
    data: [6, 4, 3],
    backgroundColor: [
        colors.yellow.base,
        colors.red.base,
        colors.blue.base,
    ],
  }]
}

let gitContributionsData = {
  labels: ["1/31", "2/3", "2/7", "2/10", "2/14", "2/17", "2/18", '2/19', '2/20', '2/21'],
  datasets: [{
    fill: false,
    label: 'Commits on Master',
    data: [1, 2, 5, 8, 10, 15, 17, 18, 22, 27, 30, 32],
    lineWidth: 2,
    borderColor: [
      colors.blue.base
    ],
    borderWidth: 3
  }]
}
