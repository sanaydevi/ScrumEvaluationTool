/**
 * The following function returns an Array four values viz: 1. Pull Request Number 2. Timestamp of
 * PR Created at 3. Timestamp of PR Closed at 4. Timestamp of PR merged at.
 * The TimeStamp follows this format : YYYY-MM-DDTHH:MM:SSZ
 * Note : If value at index '2' i.e closed_at = Null, that means that the PR is not Closed yet.
 * @param owner       The name of the owner of the repository in String format.
 * @param repo        The name of the Github repository in String format.
 * @param auth        The auth key in string format
 * @param pullNumber  The pull request number whose history is required.
 * @return            An Array of four values viz. PR Number, timestamp of creation, close and merge.
 */
import axios from 'axios';

export async function
getHistoryPR(owner : string, repo: string, auth:string, pullNumber: number){
    try{
        let arrayOfHistory = Array()
        var config = {
            headers: {'Authorization': "Bearer " + auth}
        }
        let initialPull = await axios.get("https://api.github.com/repos/" + owner +
            "/" + repo + "/pulls?state=all&direction=asc", config);
        if(initialPull.headers.hasOwnProperty("link")) {
            let last = initialPull.headers["link"].split(',');
            let total_pages_str = last[1]
            let total_pages = total_pages_str.substring(total_pages_str.lastIndexOf("page") + 5, total_pages_str.lastIndexOf(">"))
            total_pages = Number(total_pages)
            for (var j = 1; j <= total_pages; j++) {
                let pullReq = await axios.get("https://api.github.com/repos/" + owner +
                    "/" + repo + "/pulls?state=all&direction=asc&page=" + j, config);
                await pullReq.data.forEach(function (req: { number: string, created_at: string, closed_at: string, merged_at: string }) {
                    if (Number(req.number) == pullNumber) {
                        let created: string = req.created_at;
                        let closed: string = req.closed_at;
                        let merged: string = req.merged_at;
                        arrayOfHistory.push(req.number, created, closed, merged)
                        return arrayOfHistory
                    }
                })
            }
            return arrayOfHistory
        }
        else{
            await initialPull.data.forEach(function (req: { number: string, created_at: string, closed_at: string, merged_at: string }) {
                if (Number(req.number) == pullNumber) {
                    let created: string = req.created_at;
                    let closed: string = req.closed_at;
                    let merged: string = req.merged_at;
                    arrayOfHistory.push(req.number, created, closed, merged)
                    return arrayOfHistory
                }
         })
        }

    }
    catch (error) {
        console.log(error);
        return -1;
    }
}

/**
 * The following function returns the Average Number Of Comments
 * on all closed Pull Requests by considering direct comments on
 * pull requests and review comments.
 * @param owner  The name of the owner of the repository in String format.
 * @param repo   The name of the Github repository in String format.
 * @return       The average number of comments per closed pull requests.
 */
export async function
getNumComments(owner : string, repo: string, auth : string){
    try{
        var config = {
            headers: {'Authorization': "Bearer " + auth}
        }
        let issue_comment = await axios.get("https://api.github.com/repos/" + owner +
            "/" + repo + "/pulls?state=closed", config);
        if(issue_comment.headers.hasOwnProperty("link")) {
            let last = issue_comment.headers["link"].split(',');
            let total_pages_str = last[1]
            let total_pages = total_pages_str.substring(total_pages_str.lastIndexOf("page") + 5, total_pages_str.lastIndexOf(">"))
            total_pages = Number(total_pages)
            for (var j = 1; j <= total_pages; j++) {
                let inner_pull = await axios.get("https://api.github.com/repos/" + owner +
                    "/" + repo + "/pulls?state=closed&page="+j, config);
                let lengthOfClosedPullRequests = inner_pull.data.length
                let issueNumberArray = Array()
                let totalComments = 0
                inner_pull.data.forEach(function (req: { url: string }) {
                    let closedIssueNumberArray = req.url.split('/');
                    let issue_number: string = closedIssueNumberArray[closedIssueNumberArray.length - 1];
                    issueNumberArray.push(issue_number)

                });
                for (let issue_number of issueNumberArray) {
                    let commentsPerIssue = await getNumberCommentsPerPullRequest(owner, repo, Number(issue_number), auth)
                    totalComments = totalComments + Number(commentsPerIssue)
                }

                let averageNoOfComments = (totalComments / lengthOfClosedPullRequests).toFixed(2)
                return averageNoOfComments;


            }
        }
        else{
            let lengthOfClosedPullRequests = issue_comment.data.length
            let issueNumberArray = Array()
            let totalComments = 0
            issue_comment.data.forEach(function (req: { url: string }) {
                let closedIssueNumberArray = req.url.split('/');
                let issue_number: string = closedIssueNumberArray[closedIssueNumberArray.length - 1];
                issueNumberArray.push(issue_number)

            });
            for (let issue_number of issueNumberArray) {
                let commentsPerIssue = await getNumberCommentsPerPullRequest(owner, repo, Number(issue_number), auth)
                totalComments = totalComments + Number(commentsPerIssue)
            }

            let averageNoOfComments = (totalComments / lengthOfClosedPullRequests).toFixed(2)
            return averageNoOfComments;

        }

    }
    catch (error) {
        console.log(error);
        return -1;

    }

}

/**
 * The following function returns the  Number Of Comments
 * on a particular closed Pull Requests.
 * @param owner  The name of the owner of the repository in String format.
 * @param repo   The name of the Github repository in String format.
 * @param number The issue id number of the closed pull request.
 * @return       The total number of comments for a closed pull request.
 */
export async function
getNumberCommentsPerPullRequest(owner : string, repo: string,  number : number, auth: string){
    try {
        var config = {
            headers: {'Authorization': "Bearer " + auth}
        }
        let issue_comment = await axios.get("https://api.github.com/repos/" + owner +
            "/" + repo + "/pulls/" + number + "#/comments", config);
        let comments = issue_comment.data["comments"]
        let reviewComments = issue_comment.data["review_comments"]
        let totalNumberOfComments = Number(comments) + Number(reviewComments)
        return Number(totalNumberOfComments)
    }
    catch (error) {
        console.log(error)
        return -1
    }
}

/**
 Returns ALL Closed Pull Requests.
 */
export async function
getNumClosedPullRequest(owner: string, repo: string, auth: string){
    try{
        let numOfPR = 0
        var config = {
            headers: {'Authorization': "Bearer " + auth}
        }
        const pulls = await axios.get("https://api.github.com/repos/" + owner +
            "/" + repo + "/pulls?state=closed&direction=asc",config);
        if(pulls.headers.hasOwnProperty("link")) {
            let last = pulls.headers["link"].split(',');
            let total_pages_str = last[1]
            let total_pages = total_pages_str.substring(total_pages_str.lastIndexOf("page") + 5, total_pages_str.lastIndexOf(">"))
            total_pages = Number(total_pages)
            for (var j = 1; j <= total_pages; j++) {
                const innerpulls = await axios.get("https://api.github.com/repos/" + owner +
                    "/" + repo + "/pulls?state=closed&direction=asc&page=" + j, config);
                numOfPR += innerpulls.data.length
            }
        return numOfPR
        }
        else{
            const innerpulls = await axios.get("https://api.github.com/repos/" + owner +
                "/" + repo + "/pulls?state=closed&direction=asc",config);
            numOfPR += innerpulls.data.length
        }
        //console.log(numOfPR)
        return numOfPR
    } catch (error) {
        console.log(error);
    }
    return -1;
}

export async function
getNumOpenPullRequests(owner: string, repo: string, auth: string){
    try{
        let numOfPR = 0
        var config = {
            headers: {'Authorization': "Bearer " + auth}
        }
        const pulls = await axios.get("https://api.github.com/repos/" + owner +
            "/" + repo + "/pulls?state=open&direction=asc",config);
        if(pulls.headers.hasOwnProperty("link")) {
            let last = pulls.headers["link"].split(',');
            let total_pages_str = last[1]
            let total_pages = total_pages_str.substring(total_pages_str.lastIndexOf("page") + 5, total_pages_str.lastIndexOf(">"))
            total_pages = Number(total_pages)
            for (var j = 1; j <= total_pages; j++) {
                const innerpulls = await axios.get("https://api.github.com/repos/" + owner +
                    "/" + repo + "/pulls?state=open&direction=asc&page=" + j, config);
                numOfPR += innerpulls.data.length
            }
        return numOfPR
        }
        else{
            const innerpulls = await axios.get("https://api.github.com/repos/" + owner +
                "/" + repo + "/pulls?state=open&direction=asc",config);
            numOfPR += innerpulls.data.length
        }
        return numOfPR
        //console.log(numOfPR)
    } catch (error) {
        console.log(error);
    }
    return -1;
}
