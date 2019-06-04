import axios from 'axios';

//maps build file to the build name
var buildFileMap: { [key: string]: string } = {
    "pom.xml": "Maven",
    "build.gradle": "Gradle",
    "CMakeLists.txt": "CMake",
    "build.xml": "Ant",
    "Makefile": "Make",
    "package.json": "npm"
}

/**
 * Returns a list of build systems found in the repo (if an error occurs, will return empty list)
 * Currently checks for Maven, Gradle, Ant, Make, and CMake
 * Created to reduce number of GitHub API calls in the program.
 *
 * @param owner username of repo owner
 * @param repo name of repo
 */
export async function
getBuilds(owner: string, repo: string, auth: string): Promise<Array<string>>{
    let ret: Array<string> = new Array<string>();
    try{
        var config = {
            headers: {'Authorization': "Bearer " + auth}
        }
        const branchInfo = await axios.get("https://api.github.com/repos/" + owner +
        "/" + repo + "/branches/master", config);
        if(branchInfo.headers.hasOwnProperty("link")) {
            let last = branchInfo.headers["link"].split(',');
            let total_pages_str = last[1]
            let total_pages = total_pages_str.substring(total_pages_str.lastIndexOf("page") + 5, total_pages_str.lastIndexOf(">"))
            total_pages = Number(total_pages)
            for (var j = 1; j <= total_pages; j++) {
                let innerpulls = await axios.get("https://api.github.com/repos/" + owner +
                    "/" + repo + "/branches/master?page=" + j, config)
                let rootSha = innerpulls.data.commit.sha;
                ret = await (filesInTree(owner, repo, rootSha, Object.keys(buildFileMap), auth));
                ret = removeDuplicates(ret);
            }
        }
        else {
            let rootSha = branchInfo.data.commit.sha;
            ret = await (filesInTree(owner, repo, rootSha, Object.keys(buildFileMap), auth));
            ret = removeDuplicates(ret);

        }
    } catch (error){
        console.log(error);
    }
    return ret

}

/**
 * Returns true if pom.xml in latest master commit, false otherwise
 *
 * @param owner username of repo owner
 * @param repo repo name
 */
export async function
usesMaven(owner: string, repo: string, auth: string) : Promise<boolean>{
    return await fileInRepo(owner, repo, "pom.xml", auth);
}

/**
 * Returns true if able to find build.gradle in latest master commit, false otherwise
 *
 * @param owner username of repo owner
 * @param repo repo name
 */
export async function
usesGradle(owner: string, repo: string, auth: string) : Promise<boolean>{
    return await fileInRepo(owner, repo, "build.gradle", auth);
}

/**
 * Returns true if CMakeLists.txt exists in latest  master commit, false otherwise
 *
 * @param owner username of repo owner
 * @param repo name of repo
 */
export async function
usesCMake(owner: string, repo: string, auth: string) : Promise<boolean>{
    return await fileInRepo(owner, repo, "CMakeLists.txt", auth);
}

/**
 * Returns true if build.xml exists in latest master commit, false otherwise
 *
 * @param owner username of repo owner
 * @param repo owner of repo
 */
export async function
usesAnt(owner: string, repo: string, auth: string) : Promise<boolean>{
    return await fileInRepo(owner, repo, "build.xml", auth);
}

/**
 * returns true if Makefile exists in latest master commit, false otherwise
 *
 * @param owner username of repo owner
 * @param repo name of repo
 */
export async function
usesMake(owner: string, repo: string, auth: string) : Promise<boolean>{
    return await fileInRepo(owner, repo, "Makefile", auth);
}

async function fileInRepo(owner: string, repo: string, filename: string,
    auth: string): Promise <boolean>{
    try{
        var config = {
            headers: {'Authorization': "Bearer " + auth}
        }
        const branchInfo = await axios.get("https://api.github.com/repos/" + owner +
        "/" + repo + "/branches/master", config);
        let rootSha = branchInfo.data.commit.sha;
        return await fileInTree(owner, repo, rootSha, filename, auth);
    } catch (error){
        console.log(error);
    }
    return false;
}

async function fileInTree(owner: string, repo: string, treeSha: string, filename: string, auth: string): Promise<boolean>{
    var config = {
        headers: {'Authorization': "Bearer " + auth}
    }
    const tree = await axios.get("https://api.github.com/repos/" + owner + "/" +
        repo + "/git/trees/" + treeSha, config);
    for (let gitObject of tree.data.tree){
        //if it's a blob, check for pom.xml
        if (gitObject.type === "blob"){
            let objPath = gitObject.path.split("/");
            let objName = objPath[objPath.length -1];
            if (objName === filename){
                return true;
            }
        } else if (gitObject.type === "tree"){
            if (await fileInTree(owner, repo, gitObject.sha, filename, auth)){
                return true;
            }
        }
    }
    return false;
}

async function filesInTree(owner: string, repo: string, treeSha: string, filenames: Array<string>, auth: string):
Promise<Array<string>> {
    let ret: Array<string> = new Array<string>();
    var config = {
        headers: {'Authorization': "Bearer " + auth}
    }
    const tree = await axios.get("https://api.github.com/repos/" + owner + "/" +
        repo + "/git/trees/" + treeSha, config);
    for (let gitObject of tree.data.tree){
        //if it's a blob, check for pom.xml
        if (gitObject.type === "blob"){
            let objPath = gitObject.path.split("/");
            let objName = objPath[objPath.length -1];
            if (filenames.indexOf(objName) > -1){
                ret.push(buildFileMap[objName]);
            }
        } else if (gitObject.type === "tree"){
            ret = ret.concat(await filesInTree(owner, repo, gitObject.sha, filenames, auth));
        }
    }
    return ret;
}

function removeDuplicates(stringArray: Array<string>): Array<string>{
    let ret: Array<string> = new Array<string>();
    for (var i=0; i<stringArray.length; i++){
        if (ret.indexOf(stringArray[i]) === -1){
            ret.push(stringArray[i]);
        }
    }
    return ret;
}
