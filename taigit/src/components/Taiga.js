import React, { Component } from 'react';
import Select from 'react-select'
import { connect } from 'react-redux';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  grabSprintStats,
  grabSingleSprintData,
  loadAllTaigaProjectData
} from '../actions/taigaActions';
import {
  selectSprintList,
  selectSprintProgressChartData,
  selectSprintBurndownChartData,
  selectSingleSprintData,
  selectTaigaProjectData
} from '../reducers';
import {saveLayoutToLocalStorage, getLayoutFromLocalStorage, getFromLocalStorage} from '../utils/utils';
import { WidthProvider, Responsive } from "react-grid-layout";
import colors from '../styles/colors';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const layoutname = 'taiga-layout';
let originalLayouts = getLayoutFromLocalStorage(layoutname, 'layouts') || {};

class Taiga extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layouts: JSON.parse(JSON.stringify(originalLayouts)),
      taigaProjectID: getFromLocalStorage('taiga-project-id'),
      taigaSlug: getFromLocalStorage('taiga-slug')
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
    saveLayoutToLocalStorage(layoutname, 'layouts', layouts);
    this.setState({ layouts: layouts });
  }

  componentWillMount() {
    // Handle if user refreshes on taiga page
    if (Object.keys(this.props.projectData).length === 0) {
      this.props.loadAllTaigaProjectData(this.state.taigaSlug);
    }
    //this.props.selectSprintList;
    originalLayouts = getLayoutFromLocalStorage(layoutname, 'layouts') || [];
    this.setState({ layouts: JSON.parse(JSON.stringify(originalLayouts)) });
  }

  onSprintSelection = (selectedSprint) => {
    this.props.grabSingleSprintData(selectedSprint.value, this.props.projectData.id, selectedSprint.label);
    this.props.grabSprintStats(selectedSprint.value);
  }

  render() {
    return(
      <div className="app-page">
        <h2>Taiga: <p style={{color: colors.red.base, display: 'inline'}}>{this.props.projectData.name}</p></h2>
        <div className="selector">
          <Select options={this.props.sprintList}
          placeholder={this.state.selectedSprint === '' ? "Select A Sprint" : this.state.selectedSprint}
          onChange={this.onSprintSelection}
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
          <div className='box' key="3" data-grid={{ w: 5, h: 10, x: 5, y: 0, minW: 0, minH: 0 }}>
            <div className="chart">
              <span className="chart-title">Burndown Chart</span>
            <Line data={this.props.burnDownData} options={burndownOptions}/>
            </div>
          </div>
        <div className='box' key="4" data-grid={{ w: 5, h: 10, x: 5, y: 0, minW: 0, minH: 0 }}>
        <div className="chart">
          <span className="chart-title">Single Sprint Taiga Task</span>
              <Bar data={this.props.singleSprintData} options={barGraphOptions}/>
            </div>
          </div>
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}
const barGraphOptions = {
  maintainAspectRatio: true,
  responsive: true,
  scales: {
    yAxes: [{
      scaleLabel:{
        display: true,
        labelString: "Count"
      },
      ticks: {
        autoSkip: false
      }
    }],

    xAxes: [{
      scaleLabel:{
        display: true,
        labelString: "Contributors"
      },
      ticks: {
        autoSkip: false
      }
    }]
    }
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
      valueSuffix: "  points",
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
          labelString: "Points"
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
 * mapStateToProps
 * maps state in redux store (right)
 * to component props property (left)
 */
const mapStateToProps = state => ({
  projectData: selectTaigaProjectData(state),
  sprintProgress: selectSprintProgressChartData(state),
  sprintList: selectSprintList(state),
  burnDownData: selectSprintBurndownChartData(state),
  singleSprintData: selectSingleSprintData(state),
});

/**
 * connect(mapStateToProps, actions)(componentName)
 * connects the component to the redux store
 */
export default connect(mapStateToProps, {
  grabSprintStats,
  grabSingleSprintData,
  loadAllTaigaProjectData
})(Taiga)

