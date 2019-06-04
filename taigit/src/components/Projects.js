import React, { Component } from 'react';
import * as keys from '../keys.json';
import { getAuthRedirect } from '../libraries/GitHub/GitHub';
import Select from 'react-select';
import colors from "../styles/colors";
import { connect } from "react-redux";
import {
    grabSprintStats,
    grabTaigaUserId,
    grabUserProjects,
    initializeUserData,
    setTaigaProjectID,
    loadAllTaigaProjectData,
} from "../actions/taigaActions";
import {
  getUsersRepos,
  addUserInfo,
  loadAllGitHubProjectData } from "../actions/githubActions";
import { saveToLocalStorage, getFromLocalStorage } from "../utils/utils";
import {
    selectRepoList,
    selectTaigaUserID,
    selectProjectList
} from "../reducers";
import {
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import {
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { selectUserLogin } from '../reducers';

const redirect = getAuthRedirect(keys.GH_CLIENT_ID);
let auth = getFromLocalStorage('auth-key');

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taigaID: '',
      taigaPassword: '',
      repoOwner: '',
      repoName: '',
      taigaProjectSlug: '',
      taigaNumID: '',
      codacyID: '',
      auth: ''
    }

    this.onProjectAnalyze = this.onProjectAnalyze.bind(this);
    this.handleTaigaIDChange = this.handleTaigaIDChange.bind(this);
    this.handleTaigaPasswordChange = this.handleTaigaPasswordChange.bind(this);
    this.onTaigaSubmit = this.onTaigaSubmit.bind(this);
    this.onCodacySubmit = this.onCodacySubmit.bind(this);
    this.handleCodacyChange = this.handleCodacyChange.bind(this);
  }

  componentWillMount() {
    this.setState({repoOwner: getFromLocalStorage('github-owner')});
    this.setState({repoName: getFromLocalStorage('github-repo') || ''});
    this.setState({taigaProjectSlug: getFromLocalStorage('taiga-slug')});

    // Only reload data if none exists
    if (typeof this.props.repoList === 'undefined' || this.props.repoList.length === 0) {
      const auth = getFromLocalStorage('auth-key');
      this.setState({auth: getFromLocalStorage('auth-key')});
      this.props.getUsersRepos(this.props.userLogin, auth);
    }
    if (typeof this.props.projectList === 'undefined' || this.props.projectList.length === 0) {
      this.props.grabUserProjects(getFromLocalStorage('taiga-user-id'));
    }
  }

  onProjectAnalyze = (event) => {
    console.log('analyzing project!');
    event.preventDefault();

    // Save necessary data (in case of refresh)
    saveToLocalStorage('github-owner', this.state.repoOwner);
    saveToLocalStorage('github-repo', this.state.repoName);
    saveToLocalStorage('taiga-slug', this.state.taigaProjectSlug);

    // Load all Taiga Data
    this.props.loadAllTaigaProjectData(this.state.taigaProjectSlug);

    // Load all GitHub Data
    this.props.loadAllGitHubProjectData(this.state.repoOwner,
      this.state.repoName,
      this.state.auth);
  }

  onTaigaSubmit = (e) => {
    e.preventDefault();
    saveToLocalStorage('taiga-username', this.state.taigaID);
    this.props.initializeUserData(this.state.taigaID, this.state.taigaPassword);
    e.target.reset();
  }

  onCodacySubmit = (e) => {
    e.preventDefault();
    saveToLocalStorage('codacy-username', this.state.codacyID);
    e.target.reset();
  }

  // Dropdown change listeners
  onGitHubSelectChange = (gitHubRepo) => {
    this.setState({ repoOwner: gitHubRepo.value });
    this.setState({ repoName: gitHubRepo.label})
  }
  onTaigaSelectChange = (taigaProject) => {
    this.setState({ taigaProjectSlug: taigaProject.value });
  }

  // Form change listeners
  handleTaigaIDChange(event) {
    this.setState({taigaID: event.target.value});
  }
  handleTaigaPasswordChange(event) {
    this.setState({taigaPassword: event.target.value});
  }

  handleCodacyChange(event) {
    this.setState({codacyID: event.target.value});
  }

  render() {
    return (
      <div className="app-page">
        <h2>Projects</h2>
        {/* Render already paired projects here */}
        <div className="project-picker">
        <h3>New Project</h3>
          <div className="project-selector-container">
            <h4 className="project-selector-title">Select A Repo</h4>
            <div className="selector project-selector">
              <Select options={this.props.repoList}
                placeholder={this.state.repoName === '' ? "Select GitHub Repository" : this.state.repoName}
                onChange={this.onGitHubSelectChange}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary25: colors.yellow.light,
                        primary: colors.blue.light,
                    },
                })}
              />
            </div>
          </div>
          <div className="project-selector-container">
            <h4 className="project-selector-title">Select A Project</h4>
            <div className="selector project-selector">
              <Select options={this.props.projectList}
                placeholder={this.state.taigaProjectSlug === '' ? "Select Taiga Project" : this.state.taigaProjectSlug}
                onChange={this.onTaigaSelectChange}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary25: colors.yellow.light,
                        primary: colors.blue.light,
                    },
                })}
              />
            </div>
          </div>
          <form onSubmit={this.onProjectAnalyze} style={{display: 'inline'}}>
            <input type="submit" className="btn" value="Analyze Project"/>
          </form>
        </div>
        <h3>Connect Accounts</h3>
        <div className="form">
          <form onSubmit={this.onTaigaSubmit} style={{ display: 'absolute' }}>
            <input type="text"
              name="taigaID"
              style={{ flex: '10', padding: '12px 20px', width: '20%', margin: '0 8px' }}
              placeholder="Your Taiga Username"
              value={this.state.taigaID}
              onChange={this.handleTaigaIDChange}
              id="text-form"
            />
            <input type="password"
              name="taigaPassword"
              style={{ flex: '10', padding: '12px 20px', width: '20%', margin: '0 8px' }}
              placeholder="Your Taiga Password"
              value={this.state.taigaPassword}
              onChange={this.handleTaigaPasswordChange}
              id="text-form"
            />
            <input type="submit"
              value="Connect Taiga Account"
              className="btn"
              style={{ flex: '1', margin: '8px 4px', border: 'none' }}
            />
          </form>
        </div>
          <div className="form">
              <form onSubmit={this.onCodacySubmit} style={{ display: 'absolute' }}>
                  <input type="text"
                         name="codacyID"
                         style={{ flex: '10', padding: '12px 20px', width: '20%', margin: '0 8px' }}
                         placeholder="Your Codacy Username"
                         value={this.state.codacyID}
                         onChange={this.handleCodacyChange}
                         id="text-form"
                  />
                  <input type="submit"
                         value="Connect Codacy Account"
                         className="btn"
                         style={{ flex: '1', margin: '8px 4px', border: 'none' }}
                  />
                  <a href="https://www.codacy.com/">
                    <button type="button" className="gh-btn">
                      I don't have a Codacy account
                    </button>
                  </a>
                  <div className="tip">
                    <FontAwesomeIcon className="about" icon={faQuestionCircle} size="2x"
                                     title=""/>
                                     <span>Codacy helps us to provide you with code analysis
                                     for your projects. Click on this button and follow the
                                     instructions to set up an account. Make sure to add
                                     each GitHub project to your Codacy account so that you
                                     can analyze them in Taigit. Then, come back to this
                                     page and tell us your Codacy username.</span>
                  </div>
              </form>
          </div>
          <br/>
          <a href={redirect}>
              <button type="button" className="gh-btn">
                  <FontAwesomeIcon className="navFont small-icon" icon={faGithub} size="2x"/>
                  Authenticate with GitHub
              </button>
          </a>

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
  repoList: selectRepoList(state),
  userLogin: selectUserLogin(state),
  taigaUserID: selectTaigaUserID(state),
  projectList: selectProjectList(state)
});

export default connect(mapStateToProps, {
    grabSprintStats,
    getUsersRepos,
    addUserInfo,
    grabTaigaUserId,
    grabUserProjects,
    initializeUserData,
    setTaigaProjectID,
    loadAllTaigaProjectData,
    loadAllGitHubProjectData
})(Projects)
