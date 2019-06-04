import React, { Component } from 'react';
import NumberDisplay from './presentational/NumberDisplay'
import {Doughnut, Line} from 'react-chartjs-2';
import {saveLayoutToLocalStorage, getLayoutFromLocalStorage, getFromLocalStorage} from '../utils/utils';
import { WidthProvider, Responsive } from "react-grid-layout";
import colors from '../styles/colors';
import { Bar } from 'react-chartjs-2';
import { selectUserTaskDistributionChartData, selectCommitsInTimeWindow, selectTotalCommitsData } from '../reducers';
import { connect } from 'react-redux';
import { loadAllTaigaProjectData } from '../actions/taigaActions';
import { loadAllGitHubProjectData } from '../actions/githubActions';
import {
  selectTaigaProjectData,
  selectProjectTechnologiesChartData
} from '../reducers';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const layoutname = 'overview-layout';
let originalLayouts = getLayoutFromLocalStorage(layoutname, 'layouts') || {};

//export default
class Overview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layouts: JSON.parse(JSON.stringify(originalLayouts)),
      taigaSlug: getFromLocalStorage('taiga-slug') || '',
      githubOwner: getFromLocalStorage('github-owner') || '',
      githubRepo: getFromLocalStorage('github-repo') || ''
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
    // Handle if user refreshes on overview page
    if (Object.keys(this.props.taigaProjectData).length === 0) {
      const auth = getFromLocalStorage('auth-key');
      this.props.loadAllTaigaProjectData(this.state.taigaSlug);
      this.props.loadAllGitHubProjectData(this.state.githubOwner, this.state.githubRepo, auth);
    }
    originalLayouts = getLayoutFromLocalStorage(layoutname, 'layouts') || [];
    this.setState({ layouts: JSON.parse(JSON.stringify(originalLayouts)) });
  }

  render() {
    return (
      <div className="app-page">
        <h2>Overview: <p style={{color: colors.blue.base, display: 'inline'}}>
            {this.state.githubRepo}</p> | <p style={{color:colors.red.base, display: 'inline'}}>
            {this.state.taigaSlug}</p></h2>
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
            <NumberDisplay number={this.props.totalCommitsData} statistic="Total Commits"/>
          </div>
          <div className='box' key="2" data-grid={{ w: 3, h: 5, x: 2, y: 0, minW: 0, minH: 0 }}>
            <div className="chart chart-pie">
              <span className="chart-title">Technologies Used</span>
              <Doughnut data={this.props.techUsedChartData} options={{maintainAspectRatio: true, responsive: true}}/>
            </div>
          </div>
          <div className="box" key="3" data-grid={{ w: 5, h: 5, x: 3, y: 1, minW: 0, minH: 0 }}>
            <div className="chart">
              <span className = "chart-title">GitHub Contribution</span>
              <Line
                  data={this.props.commitsInWindowData}
                  options={{maintainAspectRatio: true, responsive: true}}
              />
            </div>
          </div>
          <div className='box' key="4" data-grid={{ w: 5, h: 7, x: 5, y: 0, minW: 0, minH: 0 }}>
            <div className="chart chart-horizontal-primary">
              <span className="chart-title">Taiga Task Distributions</span>
              <Bar data={this.props.taigaTaskDistribution} options={barGraphOptions}/>
            </div>
          </div>

        </ResponsiveReactGridLayout>
      </div>
    )
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
const mapStateToProps = state => ({
  taigaTaskDistribution: selectUserTaskDistributionChartData(state),
  taigaProjectData: selectTaigaProjectData(state),
  commitsInWindowData: selectCommitsInTimeWindow(state),
  totalCommitsData: selectTotalCommitsData(state),
  techUsedChartData: selectProjectTechnologiesChartData(state)
});
export default connect(mapStateToProps, {
  loadAllGitHubProjectData,
  loadAllTaigaProjectData
})(Overview)
