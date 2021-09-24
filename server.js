import {createServer} from "http";
import { exec } from "child_process";
import {Server} from "socket.io"
import fs from "fs";
const port = 2021;
var IOClient = null;
function runCommand(cmd,cwd="../"){
  console.log('executing command '+cmd)
  const proc = exec(cmd,{cwd},(e,out,err)=>{
    if(e){console.log(e)}
    if(err){console.log(`error: `+err)};
    console.log(out)
  });
  proc.stdout.on('data', function(data) {
    if(IOClient){
      IOClient.emit('conosole out',{cmd,data})
    }
      console.log(data); 
    
    
  });
  
}
const methods = {
    getDir({name,req,res}){
        const path = "../"+(name||"")
        fs.readdir(path,{withFileTypes: true},(e,files)=>{
            if(e){notFound(res,'')}
            res.end(JSON.stringify(files.map(f=>f.name)))
        })
    },
    getPlugins({res}){
      const name = "custom/plugins"
      return this.getDir({name,res})
    },
    updatePlugin({name,res}){
      runCommand(`bin/console plugin:update ${name}`);res.end('ok');
    },
    clearCache({res}){
      runCommand(`bin/console cache:clear`);res.end('ok');
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
const server = createServer(async (req,res)=>{
    if(!req.url.startsWith('/api')||req.method!="POST"){notFound(res,'not api POST');return}
    const fname = req.url.substr(5)
    if(!(fname in methods)){notFound(res,`not valid name ${fname}`);return}
    const data = JSON.parse(await getBody(req)||"{}");
    data.req = req;data.res=res;
    methods[fname](data);
});
const io = new Server(server);
io.on('connection', (socket) => {
  console.log('a client connected');
  IOClient = socket;
});
server.listen(port,'0.0.0.0',()=>{console.log('srver started')});
runCommand('npm run serve','./helper')
