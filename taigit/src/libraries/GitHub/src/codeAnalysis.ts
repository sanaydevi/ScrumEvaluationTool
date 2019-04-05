/*
Calculates McCabe cyclomatic complexity of a repository
get cyclomatic complexity of python code
*/

import axios from 'axios';
import { counter } from '@fortawesome/fontawesome-svg-core';

/**
 *  check if the file is in the list of approved formats
 * @param fileExt file extension of the specific java file
 * @return bool true if the file is a java, python or c++ file
 */
/*
function 
verifyFormat(fileExt: string) : boolean{
   let bool : boolean = false; 
   if (fileExt === "java" || fileExt === "py" || fileExt === "cpp"){
       bool = true;
   }
   return bool;
}
*/

/**
 * 
 * @param owner your user name on codacy
 * @param project your project name on codacy
 * @param token  your codacy token
 * @param ownerGit the github owner name--> in case owner of github repo is different from codacy owner
 * @param gitRepo the github repo name --> in case different from project name
 * @param auth Github auth key
 */

export async function
getCodeAnalysis(owner: string, project:string, token: string, ownerGit : string, gitRepo : string, auth : string) : Promise<any>{
    /** 
   await axios.get("https://api.codacy.com/2.0/"+ owner +"/" + project, {headers :{'api_token' : token, 'Accept' : 'application/json'}}).then(response =>{
        console.log('res\n');
        console.log(response.data);
   }).catch(error=>{
       console.log('error\n');
       console.log(error)
   });*/
   var jsonObj;
   try{
    const response = await axios.get('https://taigit-auth.herokuapp.com/codacy/'+owner+"/"+project +"/"+ token);
    let jsonString : string = response.data.commit;
    console.log(jsonString); 
    let jsonObj = JSON.parse(jsonString); 
   }catch(error){
       console.log("Error\n", error);
   }
    return jsonObj;
}
/**
 * Creates a json file that contains the cyclomatic complexity of a file
 * @param owner 
 * @param repo  
 * @param filePath
 */

 /*
export async function
getMcCabeComplexity(owner: string, repo: string, filePath : string) : Promise<string>{
    let jsonString : string = "{";
    let complexity : number = 0;
    let fileArray : Array<string>;
    try{
        console.log("CodeCov");
        const codeCov = await axios.get("https://codecov.io/api/pub/gh/"+owner+"/"+repo+"/branch/master",{"headers":{'Authorization': 'token 1f856503-6b6d-48c1-a294-bd78176176cf'}});
        console.log(codeCov);
        let verify: boolean = false;
        if(filePath.includes("/")){
            fileArray = filePath.split("/");
        } else{
            fileArray = [filePath];
        }
        let fileExt: string = fileArray[fileArray.length-1].split(".")[1];
        verify = verifyFormat(fileExt);
        if(verify){
            const file = await axios.get("https://api.github.com/repos/"+ 
            owner+"/"+repo+"/contents/"+ filePath);
            // encoded content needs to be converted to utf-8
            let uniFileContent : string = atob(file.data.content);
            //dictObj[fileArray[fileArray.length-1]] = getCodeComplexity(uniFileContent);
            complexity = getCodeComplexity(uniFileContent);
            }
        jsonString += "\""+ fileArray[fileArray.length-1]+"\" : " + complexity + "}";

    }catch(error){
        console.log(error);
    }
    console.log(jsonString);
    return jsonString;
}
*/
/*
export async function 
getMcCabeComplexity(owner: string, repo: string, sha?: string) : Promise<string>{
    let jsonString : string = "{";
    var avg : number = 0;
    let count: number = 0;
    var dictObj : {[path : string]: number} = { };
    try{
        const master = await axios.get("https://api.github.com/repos/" + owner + "/" + repo + "/branches/master",  {auth:{username: "username", password: "password"}});
        let access = (sha === undefined)? master.data.commit.sha : sha;
        var tree = await  axios.get("https://api.github.com/repos/" + 
        owner + "/" + repo + "/git/trees/" + access, {auth:{username: "username", password: "password"}});

        for (let gitObj of tree.data.tree){
            let filePath : string = "";
            let fileExt : string = "";
            let verify : boolean = false;
            if(gitObj.type === "blob"){
                filePath = gitObj.path;
                fileExt = gitObj.path.split(".").pop();
            }else if(gitObj.type === "tree"){
                getMcCabeComplexity(owner, repo, gitObj.sha);
            }

            if (!(fileExt === "")){
               verify = verifyFormat(fileExt);
            }

            if(verify){
                count++;
                const file = await axios.get("https://api.github.com/repos/"+ 
                owner+"/"+repo+"/contents/"+ filePath, {auth:{username: "username", password: "password"}});
                // encoded content needs to be converted to utf-8
                let uniFileContent : string = atob(file.data.content);
                dictObj[filePath] = getCodeComplexity(uniFileContent);
            }
            
        }
        for (var key in dictObj){
            jsonString += "\""+key+"\"" + " : " + dictObj[key]+", ";
            avg += dictObj[key];
        }
        avg = avg/count;
        jsonString += " \"average\" : " + avg + "}";
        
    }
    catch(error){
        console.log(error);
    }
    console.log("JSON: " + jsonString);
    return jsonString;
}*/