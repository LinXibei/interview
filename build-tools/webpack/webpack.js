const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');// 转成ast语法树
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');//把es6转成es5

/**
 * 分析单个模块
 * @param {*} file 
 */
function getModuleInfo(file) {
	// 读取
	const body = fs.readFileSync(file, 'utf-8');

	// 转换ast抽象语法树，把代码描述成对象
	const ast = parser.parse(body, {
		sourceType: 'module',
	})
	// console.log('ast', ast)

	// 收集依赖
	const deps = {}
	traverse(ast, {
		// visitor
		ImportDeclaration({node}) {
			const dirname = path.dirname(file);
			const abspath = './' + path.join(dirname, node.source.value)
			deps[node.source.value] = abspath
		}
	})

	// es6转es5
	const {code} = babel.transformFromAst(ast, null, {
		presets: ['@babel/preset-env']
	})
	const moduleInfo = {
		file,
		deps,
		code
	}
	return moduleInfo;
}

/**
 * 模块解析
 * @param {*} file 
 */
function parserModules(file) {
	const entry = getModuleInfo(file)
	const temp = [entry];
	const depsGraph = {}
	getDeps(temp, entry);
	temp.forEach(info => {
		depsGraph[info.file] = {
			deps: info.deps,
			code: info.code
		}
	})
	return depsGraph;
}

function getDeps(temp, {deps}) {
	Object.keys(deps).forEach(key => {
		const child = getModuleInfo(deps[key])
		temp.push(child)
		getDeps(temp, child);
	})
}

const info = parserModules('./src/index.js');
console.log(info);

