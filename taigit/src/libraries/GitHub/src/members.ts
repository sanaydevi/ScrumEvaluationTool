import axios from 'axios';
/**
 * The following function returns an Array of Arrays. Each indexed array consists of two
 * fields viz. the username of the member and the avatar_url of the member.
 * This method returns both Private and Public members if the user is authenticated and
 * a member of that particular organization.
 * @param organization  The name of the organization in String format.
 * @return       An Array Of Arrays consisting of username and avatar urls.
 */
export async function
getMemberInfo(organization : string, auth : string){
    try {
        let arrayOfUser  = Array()
        var config = {
            headers: {'Authorization': "Bearer " + auth}
        }
        let memberInfo = await axios.get("https://api.github.com/orgs/"+organization+"/members", config);
        if(memberInfo.headers.hasOwnProperty("link")){
            let last = memberInfo.headers["link"].split(',');
            let total_pages_str = last[1]
            let total_pages = total_pages_str.substring(total_pages_str.lastIndexOf("page") + 5, total_pages_str.lastIndexOf(">"))
            total_pages = Number(total_pages)
            for (var j = 1; j <= total_pages; j++) {
                let innerpulls = await axios.get("https://api.github.com/orgs/"+organization+"/members?page="+j, config);
                innerpulls.data.forEach(function (req: { login: string, avatar_url: string }) {
                    arrayOfUser.push([req.login,req.avatar_url])
                })
            }
            return(arrayOfUser)
        }
        else{
        let memberInfo = await axios.get("https://api.github.com/orgs/"+organization+"/members", config);
        memberInfo.data.forEach(function (req: { login: string, avatar_url: string }) {
            arrayOfUser.push([req.login,req.avatar_url])
        })
        return(arrayOfUser)
        }
    }
    catch (error) {
        console.log(error)
        return -1
    }

}

