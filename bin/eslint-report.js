#!/usr/bin/env node
const set = require('./../package.json')
const program = require('commander')
const sh = require('shelljs')
const { error, queue } = require('./utils')
const path = require('path')

program.version('v' + set.version + ', powered by saqqdy', '-v, --version', '查看eslint-report版本')
program
	.name('eslint-report')
	.usage('[config...]')
	.arguments('[config...]')
	.description('导出eslint报告')
	.option('-o, --output [output]', '导出文件名称', 'report.html')
	.option('-e, --ext [ext]', '需要校验的文件类型', '.vue,.js')
	.action((config, opt) => {
		let cmd = [],
			eslint = ''
		if (sh.which('./node_modules/eslint/bin/eslint.js')) {
			eslint = './node_modules/eslint/bin/eslint.js'
		} else if (sh.which('eslint')) {
			eslint = 'eslint'
		} else {
			sh.echo(error('请安装eslint'))
			sh.exit(1)
		}
		if (config.length === 0) {
			// 没有传入配置文件
		} else if (config.length === 1 && /\.json$/.test(config[0])) {
			let cfg = require(path.resolve(config[0]))
			map = {}
			cfg.forEach(el => {
				if (!map[el.admin]) map[el.admin] = []
				el.admin && map[el.admin].push(el)
			})
			for (let key in map) {
				let list = []
				map[key].forEach(el => {
					list.push(el.path)
				})
				cmd.push({
					// cmd: `${eslint} ${list.join(' ')} --ext ${opt.ext} -f /Users/saqqdy/www/saqqdy/eslint-report/src/js/reporter.js -o ${key}.html`,
					cmd: `${eslint} ${list.join(' ')} --ext ${opt.ext} -f html -o ${key}.html`,
					config: {
						slient: true,
						again: false,
						success: '导出成功',
						fail: '出错了，可能是文件过多'
					}
				})
			}
			// 传入了json配置
			cfg.forEach(el => {})
		} else {
			cmd.push({
				cmd: `${eslint} ${config.join(' ')} --ext ${opt.ext} -f html -o ${opt.output}`,
				config: {
					slient: true,
					again: false,
					success: '导出成功',
					fail: '出错了，可能是文件过多'
				}
			})
		}
		queue(cmd).then(data => {
			// console.log(data)
		})
	})

// 自定义帮助
program.on('--help', function () {
	console.log('使用案例:')
	console.log('  $ gitm init')
	console.log('  $ gitm --help')
	console.log('  $ gitm -h')
})

program.parse(process.argv)
