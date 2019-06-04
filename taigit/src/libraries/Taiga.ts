import axios from "axios"

// Interfaces
/**
 * @summary interface for login response
 * @param success : boolean, // successful login
 * @param username : string, // username
 * @param id : number        // user id
 * @param token : string     // login token
 */
interface login_response {
    success : boolean,
    username : string,
    id : number,
    token : string,
}

/**
 * @summary interface for project info
 * @param id : number,          // Project id
 * @param name : string,        // Project name
 * @param created_date : number // Date project was created
 */
interface prj_info {
    id: number,
    name: string,
    created_date: Date,
}

/**
 * @summary interface for sprint object
 * @param closed: boolean        //
 * @param closed_points: number  //
 * @param created_date: Date"    //
 * @param estimated_finish: Date //
 * @param estimated_start: Date  //
 * @param id: number             //
 * @param modified_date: Date    //
 * @param name: String           //
 * @param slug: String           //
 * @param total_points: number   //
 */
interface sprint_info {
    closed: boolean,
    closed_points: number,
    created_date: Date,
    estimated_finish: Date,
    estimated_start: Date,
    id: number,
    modified_date: Date,
    name: String,
    slug: String,
    total_points: number,
}

/**
 * @summary interface for userstory info
 * @param blocked_note: String   //
 * @param comment: String        //
 * @param created_date: Date     //
 * @param finish_date: Date      //
 * @param id: number             //
 * @param is_blocked: boolean    //
 * @param is_closed: boolean     //
 * @param milestone: number      //
 * @param milestone_name: String //
 * @param milestone_slug: String //
 * @param modified_date: Date    //
 * @param points: Object         //
 * @param ref: number            //
 * @param status: number         //
 * @param subject: String        //
 * @param total_comments: number //
 * @param total_points: number   //
 * @param version: number        //
 */
interface userstory_info {
    blocked_note: String,
    comment: String,
    created_date: Date,
    finish_date: Date,
    id: number,
    is_blocked: boolean,
    is_closed: boolean,
    milestone: number,
    milestone_name: String,
    milestone_slug: String,
    modified_date: Date,
    points: Object
    ref: number,
    status: number,
    subject: String,
    total_comments: number,
    total_points: number,
    version: number
}

/**
 * @summary interface for task info
 * @param assigned_to: number    //
 * @param blocked_note: String   //
 * @param created_date: Date     //
 * @param finished_date: Date    //
 * @param id: number             //
 * @param is_blocked: boolean    //
 * @param is_closed: boolean     //
 * @param is_iocaine: boolean    //
 * @param milestone: number      //
 * @param milestone_slug: String //
 * @param modified_date: Date    //
 * @param ref: number            //
 * @param status: number         //
 * @param subject: String        //
 * @param total_comments: number //
 * @param user_story: number     //
 * @param version: number        //
 */
interface task_info {
    assigned_to: number,
    blocked_note: String,
    created_date: Date,
    finished_date: Date,
    id: number,
    is_blocked: boolean,
    is_closed: boolean,
    is_iocaine: boolean,
    milestone: number,
    milestone_slug: String,
    modified_date: Date,
    ref: number,
    status: number,
    subject: String,
    total_comments: number,
    user_story: number,
    version: number,
}

/**
 * @summary interface for project stats
 * @param assigned_pts : number,              // Number of assigned points
 * @param assigned_pts_per_role : Object[],   // Distribution of assigned points across roles
 * @param closed_pts : number,                // Number of closed points
 * @param closed_pts_per_role : Object[],     // Point distribution based on roles
 * @param num_sprints : number,               // Number of sprints
 * @param total_pts : number,                 // Total points in the project
 */
interface prj_stats {
    assigned_pts: number,
    assigned_pts_per_role: Object[],
    closed_pts: number,
    closed_pts_per_role: Object[],
    num_sprints: number,
    total_pts: number
}

/**
 * @summary interface for sprint stats
 * @param completed_pts : Object[],    // Distribution of completed points across roles
 * @param total_pts : Object[],        // Total number of points
 * @param completed_tsks : number,     // Number of completed tasks
 * @param total_tsks : number,         // Total number of tasks
 * @param completed_us : number,       // Number of completed user stories
 * @param total_us : number,           // Total number of user stories
 * @param sprint_start : string,       // Sprint start date as a string
 * @param sprint_end : string,         // Sprint end date as a string
 * @param burndown : Object[],         // Array object containing date(string), open_points(number), optimal_points(number)
 */
interface spr_stats {
    completed_pts: Object[],
    total_pts: number,
    completed_tsks: number,
    total_tsks: number,
    completed_us: number,
    total_us: number,
    sprint_start: string,
    sprint_end: string,
    burndown: Object[]
}

/**
 * @summary interface for wikipages
 * @param id: number,            // wiki page id
 * @param slug: String,          // wiki page slug(basically the title)
 * @param content: String,       // markdown content
 * @param owner: number,         // user_id of owner
 * @param last_modifier: number, // user_id of person to last_modify it
 * @param created_date: String,  // created date
 * @param modified_date: String, // last modified date
 * @param version: number        // number of edits
 */
interface wiki_page {
    project: number,
    id: number,
    slug: string,
    content: string,
    owner: number,
    last_modifier: number,
    created_date: string,
    modified_date: string,
    editions: number,
    version: number
}

//helper_functions
function check_date_in_range(center_date : Date, day_range : number, input_date : Date) {
    //day_range is +- number of days from date.

    let date_start = new Date(center_date);
    date_start.setDate(date_start.getDate()-day_range);

    let date_end = new Date(center_date);
    date_end.setDate(date_end.getDate()+day_range);
    return input_date >= date_start && input_date <= date_end;
}

function get_days_between_dates(start : Date, end : Date) : number {
    return Math.round((end.getTime()-start.getTime())/(1000*60*60*24));
}

// API Calls
/**
 * @summary Return the response for a login
 * @param username the username to login with
 * @param password the password to login with
 * @returns boolean dictating success of login
 */
export async function
taiga_login(username : string, password : string) : Promise<login_response> {
    let response = await axios.post("https://api.taiga.io/api/v1/auth", {
        "password": password,
        "type": "normal",
        "username": username
    });

    let data = response.data;
    return {
        success : (response.status == 200),
        username : data.username,
        id : data.id,
        token : data.auth_token,
    };
}

export async function
get_projects_for_user(userId : number) : Promise<String[]> {
    let data : { slug: String; }[] = (await axios.get(`https://api.taiga.io/api/v1/projects?member=${userId}`)).data;
    let ret_arr : String[] = [];
    for(let entry of data) {
        ret_arr.push(entry.slug)
    }

    return ret_arr;
}

/**
 * @summary Get the project information for a slug
 * @param slug the url name of the project
 * @returns prj_info interface
 */
export async function
project_info(slug : string) : Promise<Object> {
    let data = await axios.get("https://api.taiga.io/api/v1/projects/by_slug?slug=" + slug)
    let info : prj_info = {id: data.data.id, name: data.data.name,
                           created_date: data.data.created_date};
  
    return info;
}

// Lists
/**
 * @summary get list of sprints for a project
 * @param projId project id
 * @returns Object[]
 */
export async function 
sprint_list(projId : number) : Promise<Array<sprint_info>> {
    let data : sprint_info[] = (await axios.get(`https://api.taiga.io/api/v1/projects/${projId}`)).data.milestones;
    return data;
}

/**
 * @summary get list of userstories for a sprint
 * @param sprintId sprint id
 * @returns Object[]
 */
export async function 
userstory_list(sprintId : number) : Promise<Object> {
    let data : userstory_info[] = (await axios.get(`https://api.taiga.io/api/v1/userstories?milestone=${sprintId}`)).data;

    return data;
}

/**
 * @summary get list of sprints for a project
 * @param userstoryId project id
 * @returns Object[]
 */
export async function 
task_list(userstoryId : number) : Promise<Object> {
    return (await axios.get(`https://api.taiga.io/api/v1/tasks?user_story=${userstoryId}`)).data;
}

/**
 * @summary Get the list of user's full name in a project
 * @param project_id Project id to get the data
 * @returns array of all the names in a project
 * [name1,name2,name3,...]
 */
export async function
get_user_list(project_id: string) : Promise<Object> {
    let response = (await axios.get(`https://api.taiga.io/api/v1/projects/${project_id}`)).data.members;
    let members_in_project: Array<Object> = [];
    for (let content of response) {
        members_in_project.push(content.full_name);
    }
  
    return(members_in_project);
}

// Stats
/**
 * @summary Get the stats of a project
 * @param projId the ID for project to get stats of
 * @returns prj_stats interface
 */
export async function
project_stats(projId : number) : Promise<Object> {
    let data = await axios.get("https://api.taiga.io/api/v1/projects/" + projId.toString() + '/stats');
    let info : prj_stats = {assigned_pts: data.data.assigned_points,
                            assigned_pts_per_role: data.data.assigned_points_per_role,
                            closed_pts: data.data.closed_points, closed_pts_per_role: data.data.closed_points_per_role,
                            num_sprints: data.data.total_milestones, total_pts: data.data.total_points};
  
    return info;
}

/**
 * @summary Get the stats for a sprint
 * @param sprintId the ID for the sprint to get stats for
 * @returns spr_stats interface
 */
export async function
sprint_stats(sprintId : number) : Promise<spr_stats> {
    let data = await axios.get("https://api.taiga.io/api/v1/milestones/"+sprintId.toString()+ '/stats');
    let info : spr_stats = {completed_pts: data.data.completed_points, total_pts: data.data.total_points,
                            completed_tsks: data.data.completed_tasks, total_tsks: data.data.total_tasks,
                            completed_us: data.data.completed_userstories, total_us: data.data.total_userstories,
                            sprint_start: data.data.estimated_start, sprint_end: data.data.estimated_finish,
                            burndown: data.data.days};
  
    return info;
}

/**
 * @summary This call returns user stats based on user Id
 * @param user Id the ID for the user to get stats for
 * @returns array of history objects
 * {
 *    total_num_projects: number
 *    roles: string
 *    total_num_contacts: number
 *    total_num_closed_userstories: number
 * }
 */
export async function
user_stats(userId : number) : Promise<Object> {
    let data = await axios.get("https://api.taiga.io/api/v1/users/"+userId.toString() + '/stats');
    let info : {total_num_projects: number, roles: string, total_num_contacts: number, 
        total_num_closed_userstories: number} =
            {total_num_projects: data.data.total_num_projects, roles: data.data.roles, 
            total_num_contacts: data.data.total_num_contacts, 
            total_num_closed_userstories: data.data.total_num_closed_userstories};
  
    return info;
}

// Information gathering
/**
 * @summary Get the History for a task
 * @param taskId the ID for the task to get history for
 * @returns array of history objects
 * {
 *      date : number,         // Date and time of history entry in milliseconds since epoch
 *      user : object,         // Taiga User Object
 *      diff_types : String[], // Names of entries in diff_values
 *      diff_values : Object   // Values of the changes listed in diff_types
 * }
 */
export async function
task_history(taskId : number) : Promise<Object> {
    let data = (await axios.get(`https://api.taiga.io/api/v1/history/task/${taskId}`)).data;

    let output : Array<Object> = [];
    for(let entry of data) {
        let new_entry = {
            date : new Date(entry.created_at).getTime(),
            user : entry.user,
            diff_types : Object.keys(entry.diff),
            diff_values : entry.values_diff
        }
        output.push(new_entry);
    }

    return output;
}

/**
 * @summary This call returns project wiki based on project Id
 * @param project Id the ID for the project to get Wiki for
 * @returns project wiki
 */
export async function
project_wiki(projectId : number) : Promise<wiki_page[]> {
    let data = await axios.get("https://api.taiga.io/api/v1/wiki?project="+projectId.toString());

    return (data.data);
}

/**
 * @summary Get a list of issues for a project
 * @param projId the ID for the project to get list of issues from
 * @returns array of issue objects
 * {
 *      date : number,         // Date and time of history entry in milliseconds since epoch
 *      note : String,         // Taiga User Object
 *      blocked : boolean,     // Is issue blocked
 *      closed : boolean,      // Is issue closed
 *      sprint : number,       // Sprint the issue is in
 *      priority : number      // Issue priority
 * }
 */
export async function
taiga_issues(projId : number) : Promise<Object>{
    let data = (await axios.get(`https://api.taiga.io/api/v1/issues?project=${projId}`)).data;
    let output : Array<Object> = [];
    for(let entry of data) {
        let new_entry = {
            date : new Date(entry.created_date).getTime(),
            note : entry.blocked_note,
            blocked : entry.is_blocked,
            closed : entry.is_closed,
            sprint : entry.milestone,
            priority : entry.priority
        }
        output.push(new_entry);
    }
  
    return output;
}

// Breakdowns
/**
 * @summary This call returns total points of a user story based on user story Id
 * @param userstoryId the ID for the User Story to get total points for
 * @returns total points
 */
export async function
userstory_total_points(userstoryId : number) : Promise<Object> {
    let data = await axios.get("https://api.taiga.io/api/v1/userstories/" + userstoryId.toString());
    let info : {total_points: number} = {total_points: data.data.total_points};
  
    return info;
}

/**
 * @summary Get the Task count with its status for each sprint
 * @param project_id Taiga project Id
 * @returns array of each members along with task count for all sprints
 * {
 *      inprogress_task_count: number
 *      name: string
 *      new_task_count: number
 *      sprint_name: string
 *      task_ready_for_test_count: number
 *      task_with_unknown_status_count: number
 *      total_task_count: number
 * }
 */
export async function
get_task_status_count(project_id: number): Promise<Object> {
    let sprint_details_array = (await axios.get(`https://api.taiga.io/api/v1/projects/${project_id}`)).data.milestones;
    let total_task_details: any = [];

    for (let sprint_detail of sprint_details_array) {
        let sprint_id = sprint_detail.id;
        let sprint_name = sprint_detail.name;
        let task_count_details_in_a_sprint =  await get_task_details(sprint_id, project_id, sprint_name);

        total_task_details.push(task_count_details_in_a_sprint);
    }
  
    return total_task_details;
}

/**
 * @summary Get the Task count with its status for a sprint in  a project
 * @param sprint_id : Milestone Id
 * @param project_id: Project Id
 * @param sprint_name: Sprint name
 * @returns array of each members along with task count for a single sprint
 * {
 *      inprogress_task_count: number
 *      name: string
 *      new_task_count: number
 *      sprint_name: string
 *      task_ready_for_test_count: number
 *      task_with_unknown_status_count: number
 *      total_task_count: number
 * }
 */
export async function
get_task_details(sprint_id: number, project_id: any, sprint_name: string)  : Promise<Object> {
    let dict_task_count: any = {};
    let json_obj: any = {};
    let big_obj: any = [];
    let response = (await axios.get(`https://api.taiga.io/api/v1/tasks?milestone=${sprint_id}&&project=${project_id}`)).data;

    for (let task_name of response) {
        let name : string;
        if (task_name.assigned_to_extra_info != null) {
            name = task_name.assigned_to_extra_info.full_name_display;
        } else {
            name = task_name.owner_extra_info.full_name_display;
        }
        let task_status_name = task_name.status_extra_info.name;
        let task_status = task_name.status_extra_info.is_closed;
        let nameKey: any;
        if (name in dict_task_count) {
            nameKey = dict_task_count[name];
            dict_task_count[name] = nameKey + 1;

            for (let i = 0; i < big_obj.length; i++) {
                if (name === big_obj[i].name) {
                    big_obj[i].total_task_count = big_obj[i].total_task_count + 1;
                    if (task_status === true) {
                        if (task_status_name === "Ready for test") {
                            big_obj[i].task_ready_for_test_count = big_obj[i].task_ready_for_test_count + 1;
                        } else if (task_status_name === "Closed") {
                            big_obj[i].closed_task_count = big_obj[i].closed_task_count + 1;
                        }
                    } else {
                        if (task_status_name === "Ready for test") {
                            big_obj[i].task_ready_for_test_count = big_obj[i].task_ready_for_test_count + 1;
                        } else if (task_status_name === "In progress") {
                            big_obj[i].inprogress_task_count = big_obj[i].inprogress_task_count + 1;
                        } else if (task_status_name === "New") {
                            big_obj[i].new_task_count = big_obj[i].new_task_count + 1;
                        }
                        else {
                            big_obj[i].task_with_unknown_status_count = big_obj[i].task_with_unknown_status_count + 1;
                        }
                    }
                 }
            }
        } else {
            // This block will execute only once for
            // for each team member
            dict_task_count[name] = 1;
            json_obj = {};
            json_obj['name'] = name;
            json_obj['sprint_name'] = sprint_name;
            json_obj['total_task_count'] = 0;
            json_obj['task_ready_for_test_count'] = 0;
            json_obj['inprogress_task_count'] = 0;
            json_obj['new_task_count'] = 0;
            json_obj['task_with_unknown_status_count'] = 0;
            json_obj['closed_task_count'] = 0;

            if (task_status === true) {
                
                json_obj['total_task_count'] = 1;
                if (task_status_name === "Ready for test") {
                    json_obj['task_ready_for_test_count'] = 1;
                } else if (task_status_name === "Closed") {
                    json_obj['closed_task_count'] = 1;
                }
            } else {
                if (task_status_name === "Ready for test") {
                    json_obj['task_ready_for_test_count'] = 1;
                } else if (task_status_name === "In progress") {
                    json_obj['inprogress_task_count'] = 1;
                } else if (task_status_name === "New") {
                    json_obj['new_task_count'] = 1;
                } else {
                    json_obj['task_with_unknown_status_count'] = 1
                }
                json_obj['total_task_count'] = 1;
            }
            big_obj.push(json_obj);
        }
    }
    return big_obj;
}

/**
 * @summary This call return a task used time based on task Id
 * @param taskId the ID for the task to assess task
 * @returns  whether the task is abnormal,task status transition, date based on task Id
 * {
 *          date : number,                //Date and time of history entry in milliseconds since epoch
 *          timecost_m: number,           // time of history entry cost in milliseconds
 *          acctime_m:number,             // time of task accumulated of this history entry cost in milliseconds
 *          timecost_h: number,           // time of history entry cost in hours
 *          acctime_h:number,             // time of task accumulated of this history entry cost in hours
 *          status_trans:entry.String[]  // Status transition array for [new, in progress, ready for test, closed]
 *
 * }
 */
export async function
task_assessment_time(taskId : number) : Promise<Object> {
    let data = (await axios.get(`https://api.taiga.io/api/v1/history/task/${taskId}`)).data;
    let output : Array<Object> = [];
    let pre : number = 0;
    let start : number = 0;
    for(let entry of data) {
        let new_entry = {
            date : new Date(entry.created_at).getTime(),    
            timecost : 0,
            acctime : 0,
            status_trans : entry.values_diff.status
        }
        
            let timecost: number;
            let acctime: number;
            if (new_entry.status_trans[0] == "New") {
                pre = new_entry.date;
                acctime = 0;
                new_entry.acctime = acctime;
                start = new_entry.date;
            } else {
                timecost= new_entry.date - pre;
                acctime = new_entry.date - start;
                new_entry.timecost = timecost;
                new_entry.acctime = acctime;
            }
        output.push(new_entry);
    }

    return output;
}

/**
 * @summary This call return sprint velocity (unit points) based on sprint Id
 * @param sprintId the ID for the access of sprint stats
 * @returns
 * {
 *      sprint_end : boolean, // if sprint end currently
 *        velocity : number   //sprint velocity
 * }
 */
export async function
sprint_velocity_pts(sprintId : number) : Promise<[boolean, number]> {
    let data = (await axios.get("https://api.taiga.io/api/v1/milestones/"+sprintId.toString()+ '/stats')).data;
    //test id:  https://api.taiga.io/api/v1/milestones/205316/stats
    //https://api.taiga.io/api/v1/milestones/219984/stats
    let current = new Date().getTime();
    let estimated_finish = new Date(data.estimated_finish).getTime();
    let sprint_end : boolean = false;
    if (current > estimated_finish){
        sprint_end = true;
    }
    let entry = {pts : data.completed_points}
    //velocity calculation according to https://www.scruminc.com/velocity/     
    let velocity : number = 0;
    for(let each of entry.pts ){
        velocity += each;
    }
    return  [sprint_end , velocity];
}

/**
 * @summary This call return a task assessment  based on task Id
 * @param taskId the ID for the task to assess task
 * @returns  whether the task is abnormal,task status transition, date based on task Id
 * * {
 *
 *          task_valid : boolean,  //is task performed valid
 *          finished : boolean,   //is task finished
 *          end_status : string,  //task's end status
 *          num_stat : number,    //task's end status in number
 *          detail: Array<Object>  //detailed log of task status change
 *             The Object in the Array has the following data type:
 *             <Object>：
 *               state_trans_valid: true,
 *               timecost: number,  //time of history entry cost in milliseconds
 *               acctime: number,   //time of task accumulated of this history entry cost in milliseconds
 *               status_trans: String[],//Status transition array
 *               user: object,         // Taiga User Object
 *               date: number,        //Date and time of history entry in milliseconds since epoch
 * }
 */
export async function
task_assessment(taskId : number) : Promise<Object> {
    let data = (await axios.get(`https://api.taiga.io/api/v1/history/task/${taskId}`)).data;
    //test case :https://api.taiga.io/api/v1/history/task/2577741
    let output : Array<Object> = [];
    let pre : number = 0;
    let start : number = 0;
    let endstatus : string = "New";
    let task_valid : boolean = true;
    for(let entry of data) {
        if(entry.values_diff.status) {//use this to ignore no-status change diff
            let new_entry = {
                state_trans_valid: true,
                timecost: 0,
                acctime: 0,
                status_trans: entry.values_diff.status,
                user: entry.user,
                date: new Date(entry.created_at).getTime(),
            }
            endstatus = new_entry.status_trans[1];
            let timecost: number;
            let acctime: number;
            if (new_entry.status_trans[0] == "New") {
                pre = new_entry.date;
                acctime = 0;
                new_entry.acctime = acctime;
                start = new_entry.date;
            } else {
                timecost= new_entry.date - pre;
                acctime = new_entry.date - start;
                new_entry.timecost = timecost;
                new_entry.acctime = acctime;
            }
            let old_status = new_entry.status_trans[0];
            let new_status = new_entry.status_trans[1];
            if ((old_status == "New" && new_status != "In progress") ||
                (old_status == "In progress" && new_status != "Ready for test") ||
                (old_status == "Ready for test" && new_status != "Closed")) {
                new_entry.state_trans_valid = false;
                task_valid = false;
            }
        output.push(new_entry);
        }
    }
    let t_num_stat : number;
    let t_finished : boolean = false;
    if(endstatus == "Closed") {
        t_finished = true;
    }
    //transfer ["New", "In progress"] ["In progress", "Ready for test"]  ["Ready for test", "Closed"])
    //into number status
    switch(endstatus) {
        case "Closed": {
            t_num_stat = 3;
            break;
        }
        case "Ready for test": {
            t_num_stat = 2;
            break;
        }
        case "In progress": {
            t_num_stat = 1;
            break;
        }
        case "New": {
            t_num_stat = 0;
            break;
        }
        default: {
            t_num_stat = 0
            break;
        }
    }
    let info : {task_valid : boolean,finished : boolean, end_status : string,num_stat : number,detail: Array<Object>}
                = {task_valid : task_valid, finished : t_finished, end_status : endstatus, num_stat : t_num_stat,detail:output};
    return info;
}

/**
 * @summary Check for user story attributes in user story title
 * @param subject the user story title as a string
 * @returns notes information about the components of a user story
 */
function process_us(subject : string) : {flag: boolean, notes: Array<string>}{
    let notes : Array<string> = ['','',''];
    let flag : boolean = false;
    if (!/^as a /.test(subject.toLowerCase())){
        notes[0] = '"As a" not found.';
        if (!flag)
            flag = true;
    }
    if (!/ i want /.test(subject.toLowerCase())){
        notes[1] = '"i want" not found.'
        if (!flag)
            flag = true;
    }
    if (!/ so that /.test(subject.toLowerCase())){
        notes[2] = '"so that" not found.'
        if (!flag)
            flag = true;
    }
    return {flag: flag, notes: notes};
}

/**
 * @summary Check user stories in a sprint
 * @param sprintId the sprint id
 * @returns 
 * {
 *      subject : user story title    // User story title
 *      flag : boolean                // Flag for correct or incorrect user story
 *      notes : Array<string>         // Information about the components of a user story
 * }
 */
export async function
eval_userstories(sprintId : number) : Promise<Object>{
    let data = (await axios.get(`https://api.taiga.io/api/v1/userstories?milestone=${sprintId}`)).data;
    let us_subjects : Array<Object> = [];
    data.forEach(function (us : {subject: string}){
        let returned : {flag: boolean, notes: Array<string>} = process_us(us.subject);
        us_subjects.push({'userstory': us.subject, 'flag': returned.flag, 'notes': returned.notes});
    });
    return us_subjects;
}

/**
 * @summary This call returns task assessment list based on sprint Id
 * @param sprint Id the ID for the sprint to get associated task for
 * @returns Array of Array of task assessment Object
 */
export async function
task_of_sprint(sprintId : number) : Promise <Object[]>  {
    let output : Array<Object> = [];
    let us_list= (await axios.get(`https://api.taiga.io/api/v1/userstories?milestone=${sprintId}`)).data;
     for(let us of us_list ) {
         let task_assess = task_of_us(us.id);
         output.push(task_assess);
     }
    return output;
}

/**
 * @summary This call returns task assessment list based on us Id
 * @param us Id the ID for the user story to get associated task for
 * @returns Array of task assessment Object
 */
export async function
task_of_us(usId : number) : Promise <Object[]>  {
    let output : Array<Object> = [];
    let task_list = (await axios.get(`https://api.taiga.io/api/v1/tasks?user_story=${usId}`)).data;
    for(let task of task_list){
        let data =(await task_assessment(task.id));
        output.push(data);
    }
    return output;
}

/**
 * @summary check if a wiki page containing a sprint retrospective for a particular sprint exists
 * @param project_id : number
 * @param sprint_id : number
 */
export async function
check_for_retrospective(project_id : number, sprint_id : number) : Promise<wiki_page | undefined> {
    //get info from taiga
    let { sprint_start, sprint_end } = await sprint_stats(sprint_id);
    let wiki_pages : wiki_page[] = await project_wiki(project_id);

    //find searchable date range
    let sprint_len = get_days_between_dates(new Date(sprint_start), new Date(sprint_end));
    let day_diff: number = 3;
    if(sprint_len <= 7) {
        //if sprint length is 1 week, search +-1 day
        day_diff = 1;
    } else if(sprint_len <= 14) {
        //if sprint length is 2 weeks, search +-2 days
        day_diff = 2;
    } else {
        //otherwise search +-3 days
        day_diff = 3;
    }


    let retro_page : wiki_page | undefined = undefined;
    for(let entry of wiki_pages) {
        //check wikipage title for the word "retrospective"
        if(/.?(retrospective).?/gmi.test(entry.slug)) {
            //then check that it's "last_modified" date is with an acceptable range from the end of the sprint
            if(check_date_in_range(new Date(sprint_end), day_diff, new Date(entry.modified_date))) {
                //if page matches, then return it.
                retro_page = entry;
                break;
            }
        }
    }
    return retro_page;
}

/**
 * @summary check if a wiki page containing a sprint review for a particular sprint exists
 * @param project_id : number
 * @param sprint_id : number
 */
export async function
check_for_review(project_id : number, sprint_id : number) : Promise<wiki_page | undefined> {
    //get info from taiga
    let { sprint_start, sprint_end } = await sprint_stats(sprint_id);
    let wiki_pages : wiki_page[] = await project_wiki(project_id);

    //find searchable date range
    let sprint_len = get_days_between_dates(new Date(sprint_start), new Date(sprint_end));
    let day_diff: number = 3;
    if(sprint_len <= 7) {
        //if sprint length is 1 week, search +-1 day
        day_diff = 1;
    } else if(sprint_len <= 14) {
        //if sprint length is 2 weeks, search +-2 days
        day_diff = 2;
    } else {
        //otherwise search +-3 days
        day_diff = 3;
    }


    let retro_page : wiki_page | undefined = undefined;
    for(let entry of wiki_pages) {
        //check wikipage title for the word "review"
        if(/.?(review).?/gmi.test(entry.slug)) {
            //then check that it's "last_modified" date is with an acceptable range from the end of the sprint
            if(check_date_in_range(new Date(sprint_end), day_diff, new Date(entry.modified_date))) {
                //if page matches, then return it.
                retro_page = entry;
                break;
            }
        }
    }
    return retro_page;
}

/**
 * @summary check if a wiki page containing a sprint review for a particular sprint exists
 * @param project_id : number
 * @param sprint_id : number
 */
export async function
check_for_planning(project_id : number, sprint_id : number) : Promise<wiki_page | undefined> {
    //get info from taiga
    let { sprint_start, sprint_end } = await sprint_stats(sprint_id);
    let wiki_pages : wiki_page[] = await project_wiki(project_id);

    //find searchable date range
    let sprint_len = get_days_between_dates(new Date(sprint_start), new Date(sprint_end));
    let day_diff: number = 3;
    if(sprint_len <= 7) {
        //if sprint length is 1 week, search +-1 day
        day_diff = 1;
    } else if(sprint_len <= 14) {
        //if sprint length is 2 weeks, search +-2 days
        day_diff = 2;
    } else {
        //otherwise search +-3 days
        day_diff = 3;
    }


    let retro_page : wiki_page | undefined = undefined;
    for(let entry of wiki_pages) {
        //check wikipage title for the word "planning"
        if(/.?(planning).?/gmi.test(entry.slug)) {
            //then check that it's "last_modified" date is with an acceptable range from the start of the sprint
            if(check_date_in_range(new Date(sprint_start), day_diff, new Date(entry.modified_date))) {
                //if page matches, then return it.
                retro_page = entry;
                break;
            }
        }
    }
    return retro_page;
}
/**
 * @summary Converts role ids to role names
 * @param projID
 * @returns dictionary pairs
 */
export async function
id_to_roles(projID : number) : Promise <{ [key: string] : string }> {
    let roles : { [key: string] : string } = {};
    let roles_data = (await axios.get(`https://api.taiga.io/api/v1/projects/${projID}`)).data.roles;
    roles_data.forEach(function  (r : {id : number, name: string}){
        roles[r.id.toString()] = r.name;
    });
    return roles;
}

/**
 * @summary converts points to numbers for distributions
 * @param projID
 * @returns dictionary pairs
 */
export async function
id_to_points(projID : number) : Promise <{ [key: string] : number }> {
    let points : { [key: string] : number } = {};
    let points_data = (await axios.get(`https://api.taiga.io/api/v1/projects/${projID}`)).data.points;
    points_data.forEach(function  (r : {id : number, value: number}){
        //let value : number = (r.value == null) ? -1 : r.value; // if the null case should be 0, uncomment and replace r.value below with value
        points[r.id.toString()]= r.value;
    });
    return points;
}

/**
 * @summary This call return list of sprint velocity (unit points) based on project Id
 * @param projectId the ID for the access of project
 * @returns
 *  * Array of [sprint_end, velocity]
 * * {
 *          sprint_end : boolen // if sprint end currently
 *          velocity : number //sprint velocity
 * }
 */
export async function
proj_spvelocity(projId : number) : Promise<Array<[boolean, number]>> {
    //let data = (await axios.get("https://api.taiga.io/api/v1/milestones/"+sprintId.toString()+ '/stats')).data;
    let sp_list =  (await axios.get(`https://api.taiga.io/api/v1/milestones?project=${projId}`)).data;
    let output : Array<[boolean, number]> = [];
    for(let sp of sp_list){
        let sp_velocity = (await sprint_velocity_pts(sp.id));
        output.push(sp_velocity);
    }
    return output.reverse();
}

