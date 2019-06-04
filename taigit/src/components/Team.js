import React, { Component } from 'react'
import { connect } from 'react-redux'
import TeamMemberCard from './presentational/TeamMemberCard'
import { Link } from 'react-router-dom';
import { getFromLocalStorage } from "../utils/utils";
import {
  getContributorsData
} from '../actions/githubActions';
import { selectBasicContributorData } from '../reducers';

class Team extends Component {
  constructor(props) {
    super(props);

    this.state = {
      githubOwner: getFromLocalStorage('github-owner') || '',
      githubRepo: getFromLocalStorage('github-repo') || ''
    };
  }

  componentWillMount() {
    if (this.props.teamMembers.length === 0) {
      let auth = getFromLocalStorage('auth-key');
      this.props.getContributorData(this.state.githubOwner, this.state.githubRepo, auth);
    }
  }

  render() {
    return(
      <div className="app-page">
        <h2>Team</h2>
          <div className="team-members">
          {this.props.teamMembers.map((memberObj) => {
            return <div className="team-member-page-card">
                    <Link to={`/team/members/${memberObj.login}`}>
                      <TeamMemberCard taigaId={memberObj.taigaId} githubId={memberObj.login} name={memberObj.login} pictureUrl={memberObj.avatar_url}/>
                    </Link>
                  </div>
          })}
        </div>
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

export default connect(mapStateToProps, { getContributorsData })(Team)
