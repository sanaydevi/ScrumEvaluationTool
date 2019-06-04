import axios from "axios"


/**
 * Gives a list of names of branches in repo.
 *
 * @param owner owner username
 * @param repository repo name
 */
export async function
getBranches(owner : string, repository : string, auth: string) : Promise<Array<string>> {
    try {
        let branches: Array<string> = [];
        var config = {
            headers: {'Authorization': "Bearer " + auth}
        }
        let response = await axios.get("https://api.github.com/repos/" +
            owner + "/" + repository + "/branches", config);
        if(response.headers.hasOwnProperty("link")){
            let last = response.headers["link"].split(',');
            let total_pages_str = last[1]
            let total_pages = total_pages_str.substring(total_pages_str.lastIndexOf("page") + 5, total_pages_str.lastIndexOf(">"))
            total_pages = Number(total_pages)
            for (var j = 1; j <= total_pages; j++) {
                let innerPull = await axios.get("https://api.github.com/repos/" +
                    owner + "/" + repository + "/branches?page=" + j, config);
                    innerPull.data.forEach(function (branch: { name: string }) {
                    branches.push(branch.name);
                })
                return branches;

            }

        }
        else {
            response.data.forEach(function (branch: { name: string }) {
                branches.push(branch.name);
            })
            return branches;
        }
    } catch (e) {
        console.log(e)
    }
    return []
}

/**
 * gives the number of commits to a branch
 *
 * @param owner repo owner username
 * @param repository repo name
 * @param branch branch name
 */
export async function
getNumBranchCommits(owner : string, repository: string, branch : string, auth : string) :
    Promise<number> {
    try {
        let len = 0
        var config = {
            headers: {'Authorization': "Bearer " + auth}
        }
        let response = await axios.get("https://api.github.com/repos/" +
            owner + "/" + repository + "/commits?sha=" + branch, config);
        if(response.headers.hasOwnProperty("link")){
            let last = response.headers["link"].split(',');
            let total_pages_str = last[1]
            let total_pages = total_pages_str.substring(total_pages_str.lastIndexOf("page") + 5, total_pages_str.lastIndexOf(">"))
            total_pages = Number(total_pages)
            for (var j = 1; j <= total_pages; j++) {
                let innerPull = await axios.get("https://api.github.com/repos/" +
                    owner + "/" + repository + "/commits?sha=" + branch + "&page=" + j, config);
                len = len + innerPull.data.length
            }
            return len
        }
        else {
            return response.data.length;
        }
    } catch(e) {
        console.log(e);
    }
    return -1;
}
