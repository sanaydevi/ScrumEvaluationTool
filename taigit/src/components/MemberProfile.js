import React, { Component } from 'react'
import { connect } from 'react-redux'
import TeamMemberCard from './presentational/TeamMemberCard'
import NumberDisplay from './presentational/NumberDisplay'
import { WidthProvider, Responsive } from "react-grid-layout";
import { saveLayoutToLocalStorage, getLayoutFromLocalStorage } from '../utils/utils';
import { selectBasicContributorData } from '../reducers';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const layoutname = 'member-layout';
let originalLayouts = getLayoutFromLocalStorage(layoutname, 'layouts') || {};

class MemberProfile extends Component {
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
    saveLayoutToLocalStorage(layoutname, 'layouts', layouts);
    this.setState({ layouts: layouts });
  }

  componentWillMount() {
    originalLayouts = getLayoutFromLocalStorage(layoutname, 'layouts') || [];
    this.setState({ layouts: JSON.parse(JSON.stringify(originalLayouts)) });
  }

  render() {
    let member = this.props.teamMembers.filter(member => member.login === this.props.match.params.memberId)[0];
    return(
      <div className="app-page">
        <h2>TeamMemberId: {this.props.match.params.memberId}</h2>
        <ResponsiveReactGridLayout
          className="layout"
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          layouts={this.state.layouts}
          onLayoutChange={(layout, layouts) =>
            this.onLayoutChange(layout, layouts)
          }
        >
          <div className='box' key="1" data-grid={{ w: 3, h: 9, x: 0, y: 0, minW: 0, minH: 0 }}>
            <div className="chart">
              <TeamMemberCard taigaId={member.taigaId} githubId={member.login} name={member.login} pictureUrl={member.avatar_url}/>
            </div>
          </div>
          <div className='box' key="3" data-grid={{ w: 2, h: 5, x: 3, y: 0, minW: 0, minH: 0 }}>
            <NumberDisplay number={member.totalCommits} statistic="Total Commits"/>
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
const mapStateToProps = state => {
  return {
    teamMembers: selectBasicContributorData(state)
  }
}

export default connect(mapStateToProps)(MemberProfile)