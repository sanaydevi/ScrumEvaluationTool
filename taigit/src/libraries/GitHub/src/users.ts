import axios from 'axios';

export async function
getUserRepos(owner: string, auth: string){
    try{
        var config = {
            headers: {'Authorization': "Bearer " + auth}
        }
        const userRepos = await axios.get("https://api.github.com/user/repos?per_page=1000", config);
        return userRepos.data;
    } catch (error) {
        console.log(error);
    }
    return -1;
}

export async function
getUserInfo(auth: string){
    try{
        var config = {
            headers: {'Authorization': "Bearer " + auth}
        }
        let userInfo = await axios.get("https://api.github.com/user", config);
        return userInfo.data;
    }
    catch (error) {
        console.log(error)
        return -1
    }
}
