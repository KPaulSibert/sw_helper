import {reactive,watch} from "vue"
import { io } from "socket.io-client";
const socket = io("ws://localhost:8080");
export default socket;
export async function api(name,args={}){
    const req = await fetch(`/api/${name}`,{method:"POST",body:JSON.stringify(args)})
    const text = await req.text()
    try{
        return JSON.parse(text)
    }catch{
        return text
    }
    
}
const DATA = reactive({})
async function loadData(){
    const path = 'custom/plugins/data.json'
    watch(DATA,(val)=>{api('writeFile',{path,val})})
    const resp = await api('readFile',{path})
    Object.assign(DATA,typeof resp=="object"?resp:{})
}
loadData();
window.DATA = DATA
