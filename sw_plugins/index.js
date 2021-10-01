import {existsSync,mkdirSync,readFileSync,writeFileSync} from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fse from "fs-extra"
console.log(fse)
const __dirname = dirname(fileURLToPath(import.meta.url));
export function mkdir(dir){
	if(!existsSync(dir)){
		mkdirSync(dir,{recursive:true})
	}
}
export function tmp(path){
	return `\`${readFileSync(__dirname+'/'+path)}\``
}
export const ROOT = './'
function buildCMS({name,label,category,isBlock,slots},root){
	// define vars
	const cebName = name.replace(/ /g,'_').toLowerCase()
	name = name.replace(/ /g,'-').toLowerCase()
	const relPath = isBlock?`blobks/${category}/${name}`:`elements/${name}`
	slots = slots || {}
	const type = isBlock?'block':'element'
	const component = `sw-cms-${type}-${name}`
	const cmsDir = root+relPath
	mkdir(cmsDir)
	// write to cms folder
	const twigFName = `/sw-cms-${type}-${name}.html.twig`
	const cssFName = `/sw-cms-${type}-${name}.scss`
	writeFileSync(cmsDir+'/index.js',eval(tmp(`cms_${type}.js`)))
	writeFileSync(cmsDir+twigFName,eval(tmp(`cms_comp_${type}.twig`)))
	writeFileSync(cmsDir+cssFName,`.sw-cms-${type}-${name} {\n\n}`)
	return relPath
}
export function buildPlugins(plugins){
	for(const plugin in plugins){
		const pplugin = ROOT+`custom/plugins/${plugin}/src/Resources/`
		const pentry = pplugin+'app/administration/src/'
		mkdir(pentry)
		const {cms} = plugins[plugin]
		const mainimports = []
		if(cms){
			const cmsRoot = pentry+'module/sw-cms/'
			for(const cmsOpts of cms){
				mainimports.push('./module/sw-cms/'+buildCMS(cmsOpts,cmsRoot)) 
			}
		}
		writeFileSync(pentry+'main.js','/* eslint-disable */\n'+mainimports.map(i=>`import '${i}';`).join('\n'));
	}
}
export function buildCMS