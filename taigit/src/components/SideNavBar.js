import React, { Component } from 'react'
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import {
  faGithub
} from '@fortawesome/free-brands-svg-icons';
import {
  faUsers,
  faChartPie,
  faCertificate,
  faArrowAltCircleLeft,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  selectGitHubDataIsLoading,
  selectTaigaDataIsLoading
} from '../reducers';

class SideNavBar extends Component {
  render() {
    return(
      <div className="navbar">
        <Link to="/">
          <div className='navButton'>
            <FontAwesomeIcon className="navFont" icon={faArrowAltCircleLeft} size="2x"/>
          </div>
        </Link>
        <Link to="/overview">
          <div className='navButton'>
            <FontAwesomeIcon className="navFont" icon={faChartPie} size="2x"/>
          </div>
        </Link>
        <Link to="/gitHub">
          <div className='navButton'>
            <FontAwesomeIcon className="navFont" icon={faGithub} size="2x"/>
          </div>
        </Link>
        <Link to="/taiga">
        <div className='navButton'>
            <FontAwesomeIcon className="navFont" icon={faCertificate} size="2x"/>
          </div>
        </Link>
        <Link to="/team">
          <div className='navButton'>
            <FontAwesomeIcon className="navFont" icon={faUsers} size="2x"/>
          </div>
        </Link>
        <div className={
          this.props.gitHubDataIsLoading ||
          this.props.taigaDataIsLoading ? 'nav-spinner loading' : 'nav-spinner'}>
          <FontAwesomeIcon className="navFont spinner" icon={faSpinner} size="2x"/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  gitHubDataIsLoading: selectGitHubDataIsLoading(state),
  taigaDataIsLoading: selectTaigaDataIsLoading(state)
});
export default connect(mapStateToProps, {})(SideNavBar)
