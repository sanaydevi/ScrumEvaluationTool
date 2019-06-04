import React, { Component } from 'react';
import NumberDisplay from './presentational/NumberDisplay'
import {
  loadAllGitHubProjectData
} from '../actions/githubActions';
import {
  selectBranchList,
  selectNumPullRequestsData,
  selectCommitsPerContributorChartData,
  selectNumPullRequestsClosedData,
  selectAvgCommentsPRData,
  selectBuildsList,
  selectGrade,
  selectNumFiles,
  selectCyclomaticComplexity} from '../reducers';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { saveLayoutToLocalStorage, getLayoutFromLocalStorage } from '../utils/utils';
import { WidthProvider, Responsive } from "react-grid-layout";
import ScrollableList from './presentational/ScrollableList';
import colors from "../styles/colors";
import { getFromLocalStorage } from "../utils/utils";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const layoutname = 'github-layout';
let originalLayouts = getLayoutFromLocalStorage(layoutname, 'layouts') || {};

class GitHub extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layouts: JSON.parse(JSON.stringify(originalLayouts)),
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

  // Calls methods in actions/githubActions to fetch data from API
  componentWillMount() {
    // Handle if user refreshes on GitHub page
    if (this.props.branches.length === 0) {
      const auth = getFromLocalStorage('auth-key');
      this.props.loadAllGitHubProjectData(this.state.githubOwner, this.state.githubRepo, auth);
    }
    originalLayouts = getLayoutFromLocalStorage(layoutname, 'layouts') || [];
    this.setState({ layouts: JSON.parse(JSON.stringify(originalLayouts)) });
  }

  render() {
    return(
      <div className="app-page">
        <h2>GitHub Repository: <p style={{display: 'inline', color: colors.blue.base}}>{this.state.githubRepo}</p></h2>
        <ResponsiveReactGridLayout
          className="layout"
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          layouts={this.state.layouts}
          onLayoutChange={(layout, layouts) =>
            this.onLayoutChange(layout, layouts)
          }
        >
          <div className='box' key="1" data-grid={{ w: 3, h: 5, x: 4, y: 0, minW: 0, minH: 0 }}>
            <div className="chart">
              <span className="chart-title">Commits Per Member</span>
              <Bar data={this.props.commitChartData} options={{maintainAspectRatio: true, responsive: true}}/>
            </div>
          </div>
          <div className='box' key="2" data-grid={{ w: 2, h: 5, x: 0, y: 0, minW: 0, minH: 0 }}>
            <NumberDisplay number={this.props.numPullRequests + this.props.numPullRequestsClosed} statistic="Pull Requests Created"/>
          </div>
          <div className='box' key="3" data-grid={{ w: 2, h: 5, x: 2, y: 0, minW: 0, minH: 0 }}>
            <NumberDisplay number={this.props.numPullRequestsClosed} statistic="Pull Requests Closed"/>
          </div>
          <div className='box' key="4" data-grid={{ w: 2, h: 9, x: 0, y: 0, minW: 0, minH: 0 }}>
            <div className="chart">
              <span className="chart-title">List of Branches</span>
              <ScrollableList items={this.props.branches}/>
            </div>
          </div>
          <div className='box' key="5" data-grid={{ w: 2, h: 5, x: 2, y: 0, minW: 0, minH: 0 }}>
            <NumberDisplay number={this.props.numPullRequests} statistic="Pull Requests Open"/>
          </div>
          <div className='box' key="6" data-grid={{ w: 2, h: 5, x: 4, y: 0, minW: 0, minH: 0 }}>
            <NumberDisplay number={this.props.avgCommentsOnPR} statistic="Average Comments on PR"/>
          </div>
          <div className="box" key="7" data-grid={{ w: 5, h: 5, x: 2, y: 2, minW: 0, minH: 0 }}>
            <NumberDisplay number={this.props.numFiles} statistic="Total files"
            notAvailable={this.props.numFiles === 'NA'}/>
          </div>
          <div className='box' key="8" data-grid={{ w: 2, h: 5, x: 2, y: 0, minW: 0, minH: 0 }}>
            <NumberDisplay number={this.props.cyclomaticComplexity} statistic="Cyclomatic Complexity"
            notAvailable={this.props.numFiles === 'NA'}/>
          </div>
          <div className='box' key="9" data-grid={{ w: 2, h: 5, x: 2, y: 0, minW: 0, minH: 0 }}>
            <NumberDisplay number={this.props.grade} statistic="Codacy Project Grade"
            notAvailable={this.props.numFiles === 'NA'}/>
          </div>
          <div className = 'box' key="10" data-grid={{w: 2, h: 9, x: 0, y: 0, minW: 0, minH: 0}}>
            <div className="chart">
              <span className ="chart-title">Builds Used</span>
              <ScrollableList items={this.props.buildsList}/>
            </div>
          </div>
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

/**
 * mapStateToProps
 * maps state in redux store (right)
 * to component props property (left)
 */
const mapStateToProps = state => ({
  branches: selectBranchList(state),
  commitChartData: selectCommitsPerContributorChartData(state),
  numPullRequests: selectNumPullRequestsData(state),
  numPullRequestsClosed: selectNumPullRequestsClosedData(state),
  avgCommentsOnPR: selectAvgCommentsPRData(state),
  buildsList: selectBuildsList(state),
  grade: selectGrade(state),
  numFiles: selectNumFiles(state),
  cyclomaticComplexity: selectCyclomaticComplexity(state)
});

/**
 * connect(mapStateToProps, actions)(componentName)
 * connects the component to the redux store
 */
export default connect(mapStateToProps, { loadAllGitHubProjectData })(GitHub)
