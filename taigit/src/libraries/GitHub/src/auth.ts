import axios from "axios"

/**
 * Takes in a client_id and creates a redirect URL to start the OAuth process
 * @param client_id  the CLIENT_ID of the GitHub Application
 * @return           a url to the authorization system
 */
export function
getAuthRedirect(client_id : string) : string {
    if(client_id == null){
        throw new Error("keys.json file is missing proper values! " +
        "Please check with the development team to ensure the GitHub " +
        "keys are set.");
    }
    return "https://github.com/login/oauth/" +
    "authorize?scope=user:email%20read:org&client_id=" + client_id;
}

/**
 * Takes in a auth server from gatekeeper and a session_code from GitHub and
 * returns the authorization token
 *
 * @param auth_server   a get endpoint for authentication
 * @param session_code  a value returned from GitHub after initial authorization
 * @return              an auth token for a user
 */
export async function
getAuthToken(auth_server: string, session_code : string) : Promise<string> {
    let url : string = auth_server + session_code;
    let oauth = await axios.get(url);
    if("error" in oauth.data) {
        throw new Error("Recieved bad code from authentication server using the following URL: " + url);
    }
    return oauth.data.token;
}
