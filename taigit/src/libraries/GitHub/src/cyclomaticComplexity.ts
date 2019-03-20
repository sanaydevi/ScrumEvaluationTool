/*
Calculates McCabe cyclomatic complexity of a repository
get cyclomatic complexity of python code
*/

import axios from 'axios';

/**
 *  check if the file is in the list of approved formats
 * @param fileExt file extension of the specific java file
 * @return bool true if the file is a java, python or c++ file
 */
function 
verifyFormat(fileExt: string) : boolean{
   let bool : boolean = false; 
   if (fileExt === "java" || fileExt === "py" || fileExt === "cpp"){
       bool = true;
   }
   return bool;
}

/**
 * 
 * calculates code  
 * @param file 
 * @see https://radon.readthedocs.io/en/latest/intro.html#cyclomatic-complexity
 * @return num points in total
 */

function 
 getCodeComplexity(code: string) : number{
    let num : number = 0;
    let ignoreComment = 0;
    let arr : Array<string> = code.split(" ");
    let arr1 : Array<string> = ["if", "elif", "case", "for", "while", "return", "void",
                                "boolean", "bool", "assert", "except", "with", "iter"];
    for(var i = 0; i < arr.length; i++){
        if(ignoreComment == 0){
            if(arr1.includes(arr[i])){
                num++;
            }else if(arr[i] === "else" && arr[i+2] === "if"){
                num++;
            }else if(arr[i]==="/*" || arr[i] === "/**"){
                ignoreComment = 1;
            }
        }else if(arr[i] ==="*/" || arr[i] === "**/"){
            ignoreComment = 0;
        }  
    }
    return num;
 }


/**
 * Creates a json file that contains the average and total cyclomatic complexity 
 * in a file.
 * @param owner 
 * @param repo  
 */
export async function 
getMcCabeComplexity(owner: string, repo: string) : Promise<string>{
    let jsonString : string = "{";
    var total : number = 0;
    var dictObj : {[path : string]: number;} = { };
    try{
        const master  = await axios.get("https://api.github.com/repos/" + 
         owner + "/" + repo + "/branches/master", 
        {auth:{username: "ansamant", password: "trentagreentealemonade31-OZ"}});
        //let sha = master.data.commit.sha;
        const tree = await  axios.get("https://api.github.com/repos/" + 
        owner + "/" + repo + "/git/trees/" + master.data.commit.sha, 
        {auth:{username: "ansamant", password: "trentagreentealemonade31-OZ"}});

        for (let gitObj of tree.data.tree){
            let filePath : string = "";
            let fileExt : string = "";
            let verify : boolean = false;
            if(gitObj.type === "blob"){
                filePath = gitObj.path;
                fileExt = gitObj.path.split(".").pop();
            }

            if (!(fileExt === "")){
               verify = verifyFormat(fileExt);
            }

            if(verify){
                const file = await axios.get("https://api.github.com/repos/"+ 
                owner+"/"+repo+"/contents/"+ filePath, 
                {auth:{username: "ansamant", password: "trentagreentealemonade31-OZ"}});
                // encoded content needs to be converted to utf-8
                let uniFileContent : string = atob(file.data.content);
                dictObj[filePath] = getCodeComplexity(uniFileContent);
            }
            
        }
        for (var key in dictObj){
            jsonString += "\""+key+"\"" + " : " + dictObj[key]+", ";
            total += dictObj[key];
        }
        jsonString += " \"total\" : " + total + "}";
        
    }
    catch(error){
        console.log(error);
    }
    return jsonString;
}