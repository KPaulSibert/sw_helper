import {createServer} from "http";
import fs from "fs";
const port = 2021;
const methods = {
    getDir({name,req,res}){
        const path = "../"+(name||"")
        fs.readdir(path,{withFileTypes: true},(e,files)=>{
            if(e){notFound(res,'')}
            res.end(JSON.stringify(files.map(f=>f.name)))
        })
    }
}
async function getBody(req){
    return new Promise((ok)=>{
      let data = ''
      req.on('data',(c)=>data+=c)
      req.on('end',()=>ok(data))
    })
  }
function notFound(res,msg="not found"){
    console.log('return "not fond"')
    res.statusCode = 404;
    res.end(msg)
  }
createServer(async (req,res)=>{
    if(!req.url.startsWith('/api')||req.method!="POST"){notFound(res,'not api POST');return}
    const fname = req.url.substr(5)
    if(!(fname in methods)){notFound(res,`not valid name ${fname}`);return}
    const data = JSON.parse(await getBody(req)||"{}");
    data.req = req;data.res=res;
    methods[fname](data)
}).listen(port)
