import colors from '../styles/colors';
import { GET_BRANCH_LIST,
  GET_COMMITS_PER_USER,
  GET_NUM_PULL_REQUESTS,
  ADD_CONTRIBUTOR_INFO,
  ADD_AUTH_KEY,
  GET_PULL_REQUESTS_CLOSED,
  GET_AVG_COMMENTS_PR,
  GET_BUILDS_LIST,
  ADD_USER_REPOS,
  ADD_USER_INFO,
  GET_TOTAL_COMMITS,
  GET_BYTES_OF_CODE,
  GET_COMMITS_FOR_TIME,
  GET_CYCLOMATIC_COMPLEXITY,
  GET_GRADE,
  GET_NUM_FILES,
  LOADING_GITHUB_DATA
} from '../actions/githubActions';

const initialState = {
  branchesList: [],
  numOfCommits: 0,
  numPullRequests: 0,
  contributors: [],
  authKey: '',
  numPullRequestsClosed: 0,
  avgCommentsOnPR : 0,
  buildsList: [],
  userRepos: [],
  user: {},
  totalCommits: 0,
  bytesOfCode: {},
  commitInTime: [],
  grade: "?",
  cyclomaticComplexity: 0,
  numFiles: 0,
  loading: false
}
/**
 * Github Reducer
 * Gets called each time there's an action
 * Currently, it always returns a spread of the current state,
 * as well as the mock data above in the property totalNumberOfCommits
 */
const githubReducer = (state = {}, action) => {
  switch(action.type) {
    case GET_BRANCH_LIST:
      return {
        ...state,
        branchesList: action.payload
      }
    case GET_COMMITS_PER_USER:
      return {
        ...state,
        numOfCommits: action.payload
      }
    case GET_NUM_PULL_REQUESTS:
      return {
        ...state,
        numPullRequests: action.payload
      }
    case GET_PULL_REQUESTS_CLOSED:
      return {
        ...state,
        numPullRequestsClosed: action.payload
      }
    case ADD_CONTRIBUTOR_INFO:
      return {
        ...state,
        contributors: action.payload
      }
    case ADD_AUTH_KEY:
      return {
          ...state,
          authKey: action.payload
      }
    case GET_AVG_COMMENTS_PR:
      return {
          ...state,
          avgCommentsOnPR: action.payload
      }
    case GET_BUILDS_LIST:
      return {
        ...state,
        buildsList: action.payload
      }
    case ADD_USER_REPOS:
      return {
        ...state,
        userRepos: action.payload
      }
    case ADD_USER_INFO:
      return {
        ...state,
        user: action.payload
      }
    case GET_TOTAL_COMMITS:
      return {
        ...state,
        totalCommits: action.payload
      }
    case GET_BYTES_OF_CODE:
      return{
        ...state,
        bytesOfCode: action.payload
      }
    case GET_COMMITS_FOR_TIME:
      return{
        ...state,
        commitInTime: action.payload
      }
    case GET_GRADE:
      return {
        ...state,
        grade: action.payload
      }
    case GET_CYCLOMATIC_COMPLEXITY:
      return {
        ...state,
        cyclomaticComplexity: action.payload
      }
    case GET_NUM_FILES:
      return {
        ...state,
        numFiles: action.payload
      }
    case LOADING_GITHUB_DATA:
      return {
        ...state,
        loading: action.payload
      }
    default:
      return {
        ...initialState,
        ...state
      }
  }
}

/**
 * Selectors
 * Allow us to compute data from the store and have components
 * used the computed data as props
 */

/**
 * Getting list of branches
 * Returns an array of branch names with the prefix 'Branch'
 * (An example of creating new data from the store)
 */
export const selectBranchList = (state) => {
  return state.branchesList;
}

/**
 * Getting number of commits per member selector
 * Taking in the current store (state), it returns
 * data formatted to display the number of commits per
 * member bar chart
 */
export const selectNumCommitsChartData = (state) => {
  return {
    labels: ['Trevor Forrey'],
    datasets: [{
      label: 'Number of Commits',
      data: [state.numOfCommits],
      backgroundColor: colors.yellow.base,
      borderWidth: 1
    }],
  }
}

/**
 * Returns technologies used in project data back in pie chart format
 */
export const selectProjectTechnologiesChartData = (state) => {
  const languageData = state.bytesOfCode;
  let languages = [];
  let bytes = [];
  let backgroundColors = [];
  let colorKeys = Object.keys(colors);
  let shades = ['light', 'base', 'dark'];
  if (languageData === undefined || Object.keys(languageData) === 0) {
    return;
  }
  Object.keys(languageData).forEach((language) => {
    languages.push(language);
    bytes.push(languageData[language]);
    let randomShade = shades[shades.lenght * Math.random() << 0];
    let randomColor = colors[colorKeys[colorKeys.length * Math.random() << 0]][randomShade];
    backgroundColors.push(randomColor);
  });
  return {
    labels: languages,
    datasets: [{
      label: 'Technologies Used',
      data: bytes,
      backgroundColor: backgroundColors
    }]
  }
}

export const selectNumPullRequestsData = (state) => {
  return state.numPullRequests;
}

export const selectCommitsPerContributorChartData = (state) => {
  let contributorList = state.contributors.map((contributor) => contributor.login);
  let commitsList = state.contributors.map((contributor) => contributor.totalCommits);
  return {
    labels: contributorList,
    datasets: [{
      label: 'Number of Commits',
      data: commitsList,
      backgroundColor: colors.yellow.base,
      borderWidth: 1
    }],
  }
}

export const selectAuthKey = (state) => {
  return state.authKey;
}

export const selectNumPullRequestsClosedData = (state) => {
  return state.numPullRequestsClosed;
}

export const selectAvgCommentsPRData = (state) => {
  return state.avgCommentsOnPR;
}

export const selectBuildsList = (state) => {
  return state.buildsList;
}

export const selectRepoList = (state) => {
  return state.userRepos.map(repo => {
    return {
      value: repo.owner,
      label: repo.name
    }
  });
}

export const selectTotalCommitsData = (state) => {
  return state.totalCommits;
}

export const selectUserLogin = (state) => {
  return state.user && state.user.login;
}

export const selectCommitsInTimeWindow = (state) => {
  let days = []
  let commits = []
  state.commitInTime.forEach(function(entry){
    days.push(entry.date);
    commits.push(entry.commits);
  });
  return{
    labels: days,
    datasets: [{
        label: 'Commits in Master',
        data: commits,
        backgroundColor: colors.blue.base,
        borderWidth: 1
    }]
  };
}

export const selectGrade = (state) => {
  return state.grade;
}

export const selectNumFiles = (state) => {
  return state.numFiles;
}

export const selectCyclomaticComplexity = (state) => {
  return state.cyclomaticComplexity;
}

export const selectIsLoading = (state) => {
  return state.loading;
}

export default githubReducer