import {createServer} from "http";
import { exec } from "child_process";
import {extendCMS,ROOT,mkdir} from "./sw_plugins/index.js"
import {Server} from "socket.io"
import fs from "fs";
const port = 2021;
async function runCommand(cmd,cwd){
  return new Promise((ok,er_cb)=>{
    if(!cwd){cwd=ROOT}
    console.log('executing command '+cmd)
    io.sockets.emit('conosole start',{cmd})
    const proc = exec(cmd,{cwd},(e,out,err)=>{
      if(e){er_cb(e)}
      if(err){er_cb(err)}
      else{ok(out)}
      io.sockets.emit('conosole end',{cmd,out:new String(e||err||out)})
    });
    proc.stdout.on('data', function(data) {
      io.sockets.emit('conosole out',{cmd,data})
    });
  })
}

const methods = {
    getDir({name,req,res}){
        const path = ROOT+(name||"")
        console.log(path)
        if(!fs.existsSync(path)){return res.end('[]')}
        fs.readdir(path,{withFileTypes: true},(e,files)=>{
            if(e||!files){return res.end('[]')}
            res.end(JSON.stringify(files.map(f=>f.name)))
        })
    },
    readFile({path,res}){path=ROOT+path
      res.end(fs.existsSync(path)?
        res.end(fs.readFileSync(path)):'')
    },
    writeFile({path,res,val}){path=ROOT+path
      mkdir(path.substring(0,path.lastIndexOf("/")))
      if(val && typeof val !="string"){val = JSON.stringify(val)}
      fs.writeFileSync(path,val);
      res.end('ok');
    },
    updatePlugin({name,res}){
      runCommand(`bin/console plugin:update ${name}`);res.end('ok');
    },
    runCommand({cmd,path,res}){
      runCommand(cmd,path);
    },
    extendCMS({name,plugin,path,res}){
      extendCMS(plugin,name,path)
      res.end('ok')
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
});
server.listen(port,'0.0.0.0',()=>{console.log('srver started')});
runCommand('npm run serve','sw_helper/helper')
