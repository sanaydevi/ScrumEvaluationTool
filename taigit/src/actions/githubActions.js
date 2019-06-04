import {
  getBranches,
  getNumCommitsFromUser,
  getNumOpenPullRequests,
  getNumClosedPullRequest,
  getContributorData,
  getNumBranchCommits,
  getNumComments,
  getAuthToken,
  getMemberInfo,
  getUserRepos,
  getUserInfo,
  getBuilds,
  getTotalCommits,
  getBytesOfCode,
  getWeeklyCommits,
  getCodeAnalysis
} from '../libraries/GitHub/GitHub';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/utils';

/** Actions types */
export const GET_BRANCH_LIST = 'GET_BRANCH_LIST';
export const GET_COMMITS_PER_USER = 'GET_COMMITS_PER_USER';
export const GET_NUM_PULL_REQUESTS = 'GET_NUM_PULL_REQUESTS';
export const ADD_CONTRIBUTOR_INFO = 'GET_CONTRIBUTOR_INFO';
export const GET_NUM_BRANCH_COMMITS = 'GET_NUM_BRANCH_COMMITS';
export const ADD_AUTH_KEY = 'ADD_AUTH_KEY';
export const GET_PULL_REQUESTS_CLOSED = 'GET_PULL_REQUESTS_CLOSED';
export const GET_AVG_COMMENTS_PR = 'GET_AVG_COMMENTS_PR';
export const GET_BUILDS_LIST = 'GET_BUILDS_LIST';
export const ADD_USER_REPOS = 'ADD_USER_REPOS';
export const ADD_USER_INFO = 'ADD_USER_INFO';
export const LOADING_GITHUB_DATA = 'LOADING_GITHUB_DATA';
export const GET_TOTAL_COMMITS = 'GET_TOTAL_COMMITS';
export const GET_BYTES_OF_CODE = 'GET_BYTES_OF_CODE';
export const GET_COMMITS_FOR_TIME = 'GET_COMMITS_FOR_TIME';
export const GET_GRADE = 'GET_GRADE';
export const GET_CYCLOMATIC_COMPLEXITY = 'GET_CYCLOMATIC_COMPLEXITY';
export const GET_NUM_FILES = 'GET_NUM_FILES';


/** Thunks (actions that return a function that calls dispatch after async request(s)) */
export const getBranchList = (owner, repo, auth) => dispatch => {
  getBranches(owner, repo, auth)
    .then(branches =>
      dispatch({type: GET_BRANCH_LIST, payload: branches})
    );
}

export const getUsersRepos = (owner, auth) => dispatch => {
  dispatch({type: LOADING_GITHUB_DATA, payload: true});
  getUserRepos(owner, auth)
    .then(repos => {
      try {
        const userReposTrimmed = repos.map((repo) => {
          let trimmedRepo = {};
          trimmedRepo.id = repo.id;
          trimmedRepo.name = repo.name;
          trimmedRepo.full_name = repo.full_name;
          trimmedRepo.owner = repo.owner.login;
          return trimmedRepo;
        })
        dispatch({type: ADD_USER_REPOS, payload: userReposTrimmed});
      } catch (e) {
        console.error(e);
      } finally {
        dispatch({type: LOADING_GITHUB_DATA, payload: false});
      }
    });
}

export const getCommitsPerUser = (owner, repo, author, auth) => dispatch => {
  getNumCommitsFromUser(owner, repo, author, auth)
    .then(numberOfCommits =>
      dispatch({type: GET_COMMITS_PER_USER, payload: numberOfCommits})
    );
}

export const getPullRequests = (owner, repo, auth) => dispatch => {
  getNumOpenPullRequests(owner, repo, auth)
    .then(numberOfPullRequests =>
      dispatch({type: GET_NUM_PULL_REQUESTS, payload: numberOfPullRequests})
    );
}

export const getMembersInfo = (organization, auth) => dispatch => {
  getMemberInfo(organization, auth)
    .then(memberInfo => {
      //TODO call members info dispatch
    });
}

export const getContributorsData = (owner, repo, auth) => dispatch => {
  getContributorData(owner, repo, auth)
    .then((contributorData) => {
      try {
        const authorList = contributorData.map((userInfo) => {
          let authorInfo = {};
          authorInfo.avatar_url = userInfo.author.avatar_url;
          authorInfo.login = userInfo.author.login;
          authorInfo.id = userInfo.author.id;
          authorInfo.url = userInfo.author.url;
          authorInfo.totalCommits = userInfo.total;
          return authorInfo;
        });
        dispatch({type: ADD_CONTRIBUTOR_INFO, payload: authorList})
      } catch (e) {
        console.error(e);
      }
    });
}

export const getBranchCommits = (owner, repository, branch, auth) => dispatch => {
  getNumBranchCommits(owner, repository, branch, auth)
    .then((numBranchCommits) =>
        dispatch({type: GET_NUM_BRANCH_COMMITS, payload: numBranchCommits})
    );
}
export const getCommitsInWindow = (owner, repo, auth) => dispatch => {
  getWeeklyCommits(owner, repo, auth)
    .then((commitsInWindow) =>
        dispatch({type: GET_COMMITS_FOR_TIME, payload: commitsInWindow})
  );
}

export const getAuthKey = (auth_server, storeKey) => dispatch => {
  getAuthToken(auth_server, storeKey)
      .then((authKey) => {
        saveToLocalStorage('auth-key', authKey);
        dispatch({type: ADD_AUTH_KEY, payload: authKey})
      });
}

export const getAvgCommentsPR = (owner, repo, auth) => dispatch => {
  getNumComments(owner, repo, auth)
    .then(avgNumberofComments =>
      dispatch({type: GET_AVG_COMMENTS_PR, payload: avgNumberofComments})
    );
}

export const getBuildsList = (owner, repo, auth) => dispatch => {
  getBuilds(owner, repo, auth)
    .then(buildsList =>
      dispatch({type: GET_BUILDS_LIST, payload: buildsList})
    );
}

export const getTotalNumberCommits = (owner, repo, auth) => dispatch => {
  getTotalCommits(owner, repo, auth)
    .then(totalCommits =>
      dispatch({type: GET_TOTAL_COMMITS, payload: totalCommits})
  );
}


export const addUserInfo = (auth) => dispatch => {
  getUserInfo(auth)
    .then(userInfo =>
      dispatch({type: ADD_USER_INFO, payload: userInfo})
    );
}

/**
 * Calls all github api calls and dispatches result to the redux store
 * @param {\Owner of the repo} owner
 * @param {Name of the repository} repo
 * @param {Github auth token} auth
 */
export const loadAllGitHubProjectData = (owner, repo, auth) => async(dispatch) => {
  dispatch({type: LOADING_GITHUB_DATA, payload: true});

  const branches = await getBranches(owner, repo, auth);
  dispatch({type: GET_BRANCH_LIST, payload: branches});

  const numberOfPullRequests = await getNumOpenPullRequests(owner, repo, auth)
  dispatch({type: GET_NUM_PULL_REQUESTS, payload: numberOfPullRequests});

  const contributorInfo = await getContributorData(owner, repo, auth);

  const numberOfClosedPullRequests = await getNumClosedPullRequest(owner, repo, auth)
  dispatch({type: GET_PULL_REQUESTS_CLOSED, payload: numberOfClosedPullRequests});

  try {
    console.log('contributor info: ', contributorInfo);
    const authorList = contributorInfo.map((userInfo) => {
      let authorInfo = {};
      authorInfo.avatar_url = userInfo.author.avatar_url;
      authorInfo.login = userInfo.author.login;
      authorInfo.id = userInfo.author.id;
      authorInfo.url = userInfo.author.url;
      authorInfo.totalCommits = userInfo.total;
      return authorInfo;
    });
    dispatch({type: ADD_CONTRIBUTOR_INFO, payload: authorList});
  } catch (error) {
    console.error('Error getting contributor info: ', error);
  }

  const numberOfBranchCommits = await getNumBranchCommits(owner, repo, branches, auth);
  dispatch({type: GET_NUM_BRANCH_COMMITS, payload: numberOfBranchCommits});

  // TODO check to see if project is in an organization, if so, call the following
  // const memberInfo = await getMemberInfo(organization, auth);
  //dispatch({type: GET_MEMBER_INFO, payload: memberInfo});

  const avgPRComments = await getNumComments(owner, repo, auth);
  dispatch({type: GET_AVG_COMMENTS_PR, payload: avgPRComments});

  const buildsList = await getBuilds(owner, repo, auth);
  dispatch({type: GET_BUILDS_LIST, payload: buildsList});

  const totalCommitOverview = await getTotalCommits(owner, repo, auth);
  dispatch({type: GET_TOTAL_COMMITS, payload: totalCommitOverview});

  const bytesOfCode = await getBytesOfCode(owner, repo, auth);
  dispatch({type: GET_BYTES_OF_CODE, payload: bytesOfCode});

  const commitInTime = await getWeeklyCommits(owner, repo, auth);
  dispatch({type: GET_COMMITS_FOR_TIME, payload: commitInTime});

  const analysis = await getCodeAnalysis(getFromLocalStorage("codacy-username"),
    repo, owner, repo, auth);

  // Try to access codacy values (user might not be connected)
  try{
    let grade = analysis.grade;
    let cc = analysis.complexity;
    let filecount = analysis.fileCount;
    dispatch({type: GET_GRADE, payload:grade});
    dispatch({type: GET_CYCLOMATIC_COMPLEXITY, payload: cc});
    dispatch({type: GET_NUM_FILES, payload: filecount});
  } catch (error){
    console.log(error);
    dispatch({type: GET_GRADE, payload: "NA"});
    dispatch({type: GET_CYCLOMATIC_COMPLEXITY, payload: "NA"});
    dispatch({type: GET_NUM_FILES, payload: "NA"});
  }

  dispatch({type: LOADING_GITHUB_DATA, payload: false});
}