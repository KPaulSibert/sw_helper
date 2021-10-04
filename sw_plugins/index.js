import {existsSync,mkdirSync,readdir,readdirSync,readFileSync,renameSync,writeFileSync} from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import replace from "replace"
import fse from "fs-extra"
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
const CMS_PATH = ROOT+'vendor/shopware/administration/Resources/app/administration/src/module/sw-cms'
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
export function extendCMS(plugin,name,path){
	const isBlock = path.startsWith('/blocks')
	const type = isBlock?'block':'element'
	const plugPath = ROOT+`custom/plugins/${plugin}/src/Resources/app/administration/src/module/sw-cms`

	const oldKebab = path.split('/').pop()
	const oldSnap = oldKebab.replace(/-/g,'_')
	const newKebab = name.replace(/ /g,'-').toLowerCase()
	const newSnap = name.replace(/ /g,'_').toLowerCase()
	const newPath = path.replace(oldKebab,newKebab)
	const plugSFPath = ROOT+`custom/plugins/${plugin}/src/Resources/views/storefront/${type}/cms-${type}-${newKebab}.html.twig`
	const SFPath = ROOT+`vendor/shopware/storefront/Resources/views/storefront/${type}/cms-${type}-${oldKebab}.html.twig`
	fse.copySync(CMS_PATH+path,plugPath+newPath)
	fse.copySync(SFPath,plugSFPath)
	replace({
		regex:oldKebab,
		replacement:newKebab,
		paths:[plugPath+newPath,plugSFPath],
		recursive:true
	})
	replace({
		regex:oldSnap,
		replacement:newSnap,
		paths:[plugPath+newPath,plugSFPath],
		recursive:true
	})
	function replaceFiles(dir){
		for(const name of readdirSync(dir)){
			if(!name.includes('.')){replaceFiles(dir+'/'+name)}
			else if (name.includes(oldKebab)){
				const newName = name.replace(oldKebab,newKebab)
				renameSync(`${dir}/${name}`,`${dir}/${newName}`)
			}
		}
	}
	replaceFiles(plugPath+newPath)
}