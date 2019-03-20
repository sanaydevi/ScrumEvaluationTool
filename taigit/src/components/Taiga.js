import React, { Component } from 'react';
import Select from 'react-select'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { grabTaigaData, grabSprintStats } from '../actions/taigaActions';
import { selectSprintList, selectSprintProgressChartData, selectUserTaskDistributionChartData } from '../reducers';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/utils';
import { WidthProvider, Responsive } from "react-grid-layout";
import colors from '../styles/colors';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const layoutname = 'taiga-layout';
let originalLayouts = getFromLocalStorage(layoutname, 'layouts') || {};

class Taiga extends Component {
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
    this.props.grabTaigaData();
    this.props.grabSprintStats();
    originalLayouts = getFromLocalStorage(layoutname, 'layouts') || [];
    this.setState({ layouts: JSON.parse(JSON.stringify(originalLayouts)) });
  }

  render() {
    return(
      <div className="app-page">
        <h2>Taiga</h2>
        <div className="selector">
          <Select options={this.props.sprintList}
          theme={(theme) => ({
            ...theme,
            colors: {
            ...theme.colors,
              primary25: colors.yellow.light,
              primary: colors.blue.light,
            },
          })} />
        </div>
        <ResponsiveReactGridLayout
          className="layout"
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          layouts={this.state.layouts}
          onLayoutChange={(layout, layouts) =>
            this.onLayoutChange(layout, layouts)
          }
        >
          <div className='box' key="1" data-grid={{ w: 4, h: 9, x: 0, y: 0, minW: 0, minH: 0 }}>
            <div className="chart chart-pie">
              <span className="chart-title">Task Progress</span>
              <Doughnut data={this.props.sprintProgress} options={{maintainAspectRatio: true, responsive: true}}/>
            </div>
          </div>
          <div className='box' key="2" data-grid={{ w: 5, h: 10, x: 3, y: 0, minW: 0, minH: 0 }}>
            <div className="chart">
              <span className="chart-title">Taiga Tasks</span>
              <Bar data={this.props.userTaskDistribution} options={{maintainAspectRatio: true, responsive: true}}/>
            </div>
          </div>
          <div className='box' key="3" data-grid={{ w: 5, h: 10, x: 5, y: 0, minW: 0, minH: 0 }}>
            <div className="chart">
              <span className="chart-title">Burndown Chart</span>
            <Line data={burnDownData} options={burndownOptions}/>
            </div>
          </div>
          <h4>{this.props.storeData}</h4>
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}


let burnDownData = {
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    datasets: [{
      fill: false,
      label: 'Ideal Burndown',
      color: 'rgba(255,0,0,0.25)',
      lineWidth: 2,
      data: [98, 91, 84, 77, 70, 63, 56, 49, 42, 35, 28, 21, 14, 7],
      backgroundColor: [ colors.red.base ],
      borderColor: [ colors.red.base ]
      },
    {
      fill: false,
      label: 'Actual Burndown',
      color: 'rgba(0,120,200,0.75)',
      marker: {radius: 6},
      data: [98, 110, 102, 85, 78, 69, 60, 49, 35, 40, 29, 20, 10, 0],
      backgroundColor: [ colors.blue.base ],
      borderColor: [ colors.blue.base ]
    }
  ]
}


const burndownOptions = {
    plotOptions: {
      line: {
        lineWidth: 3
      },
      tooltip: {
        hideDelay: 200
      }
    },
    maintainAspectRatio: true,
    responsive: true,
    tooltip: {
      valueSuffix: "  hrs",
      crosshairs: true,
      shared: true
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 0
    },
    scales: {
      yAxes: [{
        scaleLabel:{
          display: true,
          labelString: "Hours"
        }
      }],

      xAxes: [{
        scaleLabel:{
          display: true,
          labelString: "Days"
        }
      }]
      }
    }


/**
 * Declaring the types for all props that Taiga component uses
 */
Taiga.propTypes = {
  grabTaigaData: PropTypes.func.isRequired,
  data: PropTypes.string
}

/**
 * mapStateToProps
 * maps state in redux store (right)
 * to component props property (left)
 */
const mapStateToProps = state => ({
  storeData: state.taiga.taigaData,
  sprintProgress: selectSprintProgressChartData(state),
  userTaskDistribution: selectUserTaskDistributionChartData(state),
  sprintList: selectSprintList(state)
});

/**
 * connect(mapStateToProps, actions)(componentName)
 * connects the component to the redux store
 */
export default connect(mapStateToProps, { grabTaigaData, grabSprintStats })(Taiga)