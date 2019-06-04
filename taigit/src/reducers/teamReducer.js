import {
  ADD_CONTRIBUTOR_INFO
} from '../actions/githubActions';

const initialState = {
  contributors: []
}

/**
 * Team Reducer
 * Gets called each time there's an action
 * Currently, it always returns a spread of the current state,
 * as well as the mock data above in the property teamMembers
 */
const teamReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_CONTRIBUTOR_INFO:
        action.payload.map((contributor) => contributor.taigaId = 'NA');
        return {
          ...state,
          contributors: action.payload
        }
    default:
      return {
        ...initialState,
        ...state
      }
  }
}

export const selectBasicContributorData = (state) => {
  return state.contributors;
}

export default teamReducer