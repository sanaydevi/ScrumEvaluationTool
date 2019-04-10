import axios from 'axios';

export async function
getNumPullRequests(owner: string, repo: string, auth: string){
    try{
        let numOfPR = 0
        var config = {
            headers: {'Authorization': "Bearer " + auth}
        }
        const pulls = await axios.get("https://api.github.com/repos/" + owner +
            "/" + repo + "/pulls?state=all&direction=asc", config);
        let last = pulls.headers["link"].split(',');
        let total_pages_str = last[1]
        let total_pages = total_pages_str.substring(total_pages_str.lastIndexOf("page") + 5,total_pages_str.lastIndexOf(">"))
        total_pages = Number(total_pages)
        for(var j =1 ; j <= total_pages;j++){
            const innerpulls = await axios.get("https://api.github.com/repos/" + owner +
                "/" + repo + "/pulls?state=all&direction=asc&page=j", config);
            numOfPR += innerpulls.data.length

        }
        return numOfPR
    } catch (error) {
        console.log(error);
    }
    return -1;
}