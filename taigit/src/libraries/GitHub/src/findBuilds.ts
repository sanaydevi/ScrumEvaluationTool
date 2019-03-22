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
getBuilds(owner: string, repo: string): Promise<Array<string>>{
    let ret: Array<string> = new Array<string>();
    try{
        const branchInfo = await axios.get("https://api.github.com/repos/" + owner + 
        "/" + repo + "/branches/master", );
        let rootSha = branchInfo.data.commit.sha;
        ret = await (filesInTree(owner, repo, rootSha, Object.keys(buildFileMap)));
        ret = removeDuplicates(ret);
    } catch (error){
        console.log(error);
    }
    return ret;
}

/**
 * Returns true if pom.xml in latest master commit, false otherwise
 * 
 * @param owner username of repo owner
 * @param repo repo name
 */
export async function
usesMaven(owner: string, repo: string) : Promise<boolean>{
    return await fileInRepo(owner, repo, "pom.xml");
}

/**
 * Returns true if able to find build.gradle in latest master commit, false otherwise
 * 
 * @param owner username of repo owner
 * @param repo repo name
 */
export async function
usesGradle(owner: string, repo: string) : Promise<boolean>{
    return await fileInRepo(owner, repo, "build.gradle");
}

/**
 * Returns true if CMakeLists.txt exists in latest  master commit, false otherwise
 * 
 * @param owner username of repo owner
 * @param repo name of repo
 */
export async function
usesCMake(owner: string, repo: string) : Promise<boolean>{
    return await fileInRepo(owner, repo, "CMakeLists.txt");
}

/**
 * Returns true if build.xml exists in latest master commit, false otherwise
 * 
 * @param owner username of repo owner
 * @param repo owner of repo
 */
export async function
usesAnt(owner: string, repo: string) : Promise<boolean>{
    return await fileInRepo(owner, repo, "build.xml");
}

/**
 * returns true if Makefile exists in latest master commit, false otherwise
 * 
 * @param owner username of repo owner
 * @param repo name of repo
 */
export async function 
usesMake(owner: string, repo: string) : Promise<boolean>{
    return await fileInRepo(owner, repo, "Makefile");
}

async function fileInRepo(owner: string, repo: string, filename: string): Promise <boolean>{
    try{
        const branchInfo = await axios.get("https://api.github.com/repos/" + owner + 
        "/" + repo + "/branches/master");
        let rootSha = branchInfo.data.commit.sha;
        return await fileInTree(owner, repo, rootSha, filename);
    } catch (error){
        console.log(error);
    }
    return false;
}

async function fileInTree(owner: string, repo: string, treeSha: string, filename: string): Promise<boolean>{
    const tree = await axios.get("https://api.github.com/repos/" + owner + "/" +
        repo + "/git/trees/" + treeSha);
    for (let gitObject of tree.data.tree){
        //if it's a blob, check for pom.xml
        if (gitObject.type === "blob"){
            let objPath = gitObject.path.split("/");
            let objName = objPath[objPath.length -1];
            if (objName === filename){
                return true;
            }
        } else if (gitObject.type === "tree"){
            if (await fileInTree(owner, repo, gitObject.sha, filename)){
                return true;
            }
        }
    }
    return false;
}

async function filesInTree(owner: string, repo: string, treeSha: string, filenames: Array<string>): 
Promise<Array<string>> {
    let ret: Array<string> = new Array<string>();
    const tree = await axios.get("https://api.github.com/repos/" + owner + "/" +
        repo + "/git/trees/" + treeSha);
    for (let gitObject of tree.data.tree){
        //if it's a blob, check for pom.xml
        if (gitObject.type === "blob"){
            let objPath = gitObject.path.split("/");
            let objName = objPath[objPath.length -1];
            if (filenames.indexOf(objName) > -1){
                ret.push(buildFileMap[objName]);
            }
        } else if (gitObject.type === "tree"){
            ret = ret.concat(await filesInTree(owner, repo, gitObject.sha, filenames));
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
