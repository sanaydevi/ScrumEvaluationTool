import {
  project_info, sprint_list,
  get_task_details, sprint_stats,
  get_task_status_count,
  taiga_login, get_projects_for_user
} from '../libraries/Taiga';
import {saveToLocalStorage} from "../utils/utils";

/** Actions types */
export const GRAB_TAIGA_DATA = 'GRAB_TAIGA_DATA'
export const GET_SPRINT_STATS = 'GET_SPRINT_STATS'
export const GET_SINGLE_SPRINT_STATS = 'GET_SINGLE_SPRINT_STATS'
export const GET_SPRINT_NAMES = 'GET_SPRINT_NAMES'
export const GET_TASK_STATS = 'GET_TASK_STATS'
export const TAIGA_LOGIN = 'TAIGA_LOGIN'
export const GET_USER_PROJECTS = 'GET_USER_PROJECTS'
export const LOADING_TAIGA_DATA = 'LOADING_TAIGA_DATA';

/** Thunks (actions that return a function that calls dispatch after async request(s)) */
export const grabTaigaData = (slugName) => async(dispatch) => {
  const taigaProjectInfo = await project_info(slugName);
  taigaProjectInfo.slugName = slugName;
  dispatch({type: GRAB_TAIGA_DATA, payload: taigaProjectInfo});
}

export const setTaigaProjectID = (slugName) => dispatch => {
  project_info(slugName) // give the slug name
    .then((taigaProjectInfo) => {
        saveToLocalStorage('taiga-project-id', taigaProjectInfo.id);
        dispatch({type: GRAB_TAIGA_DATA, payload: taigaProjectInfo});
    });
}

export const grabSprintStats = (sprintID) => dispatch => {
  sprint_stats(sprintID)
    .then((sprintStats) => {
      dispatch({type: GET_SPRINT_STATS, payload: sprintStats});
    });
}

export const grabTaskStats = (projectId) => dispatch => {
  get_task_status_count(projectId).then((taskStats) => {
    dispatch({type: GET_TASK_STATS, payload: taskStats});
  });
}
export const grabSingleSprintData = (sprintId, projectId, sprintName) => dispatch => {
  get_task_details(sprintId, projectId, sprintName)
    .then((singleSprintStats) => {
      dispatch({type: GET_SINGLE_SPRINT_STATS, payload: singleSprintStats});
    });
}
export const grabSprintNames = (projectId) => dispatch => {
  sprint_list(projectId)
    .then((sprintData) => {
      dispatch({type: GET_SPRINT_NAMES, payload: sprintData});
    });
}

export const grabTaigaUserId = (taigaId, taigaPass) => dispatch => {
  taiga_login(taigaId, taigaPass)
    .then((loginData) => {
        dispatch({type: TAIGA_LOGIN, payload: loginData});
    });
}

export const grabUserProjects = (userId) => async(dispatch) => {
  dispatch({type: LOADING_TAIGA_DATA, payload: true});
  try {
    const projectList = await get_projects_for_user(userId);
    dispatch({type: GET_USER_PROJECTS, payload: projectList});
  } catch (e) {
    console.error(e);
  } finally {
    dispatch({type: LOADING_TAIGA_DATA, payload: false});
  }
}

export const initializeUserData = (username, password) => dispatch => {
  taiga_login(username, password)
    .then((loginData) => {
        dispatch({type: TAIGA_LOGIN, payload: loginData});
        return loginData.id;
    })
    .then((userId) => {
        saveToLocalStorage('taiga-user-id', userId);
        return get_projects_for_user(userId);
    })
    .then((projectList) => {
        dispatch({type: GET_USER_PROJECTS, payload: projectList});
    });
}

export const loadAllTaigaProjectData = (slugName) => async (dispatch) => {
  dispatch({type: LOADING_TAIGA_DATA, payload: true});

  // Load basic project info
  const taigaProject = await project_info(slugName);
  taigaProject.slugName = slugName;
  saveToLocalStorage('taiga-project-id', taigaProject.id);
  dispatch({type: GRAB_TAIGA_DATA, payload: taigaProject});

  // Load task stats for entire project
  const projectTaskStats = await get_task_status_count(taigaProject.id);
  dispatch({type: GET_TASK_STATS, payload: projectTaskStats});

  // Load list of sprint names
  const sprintList = await sprint_list(taigaProject.id);
  dispatch({type: GET_SPRINT_NAMES, payload: sprintList});

  const firstSprintID = sprintList[0].id;
  const firstSprintName = sprintList[0].name;

  // Load stats of the first sprint
  const firstSprintStats = await sprint_stats(firstSprintID);
  dispatch({type: GET_SPRINT_STATS, payload: firstSprintStats});

  // Load task details for the first sprint
  const firstSprintTaskDetails = await get_task_details(firstSprintID, taigaProject.id, firstSprintName);
  dispatch({type: GET_SINGLE_SPRINT_STATS, payload: firstSprintTaskDetails});

  dispatch({type: LOADING_TAIGA_DATA, payload: false});
}