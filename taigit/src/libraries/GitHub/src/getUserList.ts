import axios from "axios";
/**
 * The following function returns the list of all contributer usernames in a
 * respository.
 * @param owner  The name of the owner of the repository in String format.
 * @param repo   The name of the Github repository in String format.
 * @return       The list consisting of usernames of All Contributers in the repo.
 */
export  async function
getContributerNames(owner : string, repo: string, auth: string){
    try{
        var config = {
            headers: {'Authorization': "Bearer " + auth}
        }
        let listOfContributers = await axios.get("https://api.github.com/repos/" + owner +
            "/" + repo + "/contributors", config);
        let contriNames : Array<string>  = [];
        listOfContributers.data.forEach(function (username :{login: string}){
            contriNames.push(username.login)
        });
        return contriNames
    }
    catch (error) {
        console.log(error)
        return -1
    }

}

//getContributerNames("ser574-green-team", "taigit");
