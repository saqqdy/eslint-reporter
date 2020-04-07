#!/usr/bin/env node
const set = require('./../package.json')
const program = require('commander')
const sh = require('shelljs')
const { error, queue } = require('./utils')
const path = require('path')

program.version('v' + set.version + ', powered by saqqdy', '-v, --version', '查看eslint-reporter版本')
program
	.name('eslint-reporter')
	.usage('[config...]')
	.arguments('[config...]')
	.description('导出eslint报告')
	.option('-o, --output [output]', '导出文件名称', '')
	.option('-e, --ext [ext]', '需要校验的文件类型', '.vue,.js')
	.option('-f, --format [format]', '导出的类型', '')
	.option('-q, --quiet [quiet]', '只显示问题记录', false)
	.option('--fix [fix]', '修复可自动修复的问题', false)
	.action((config, opt) => {
		let cmd = [],
			eslint = '',
			format = ''
		if (sh.which('./node_modules/eslint/bin/eslint.js')) {
			eslint = './node_modules/eslint/bin/eslint.js'
		} else if (sh.which('eslint')) {
			eslint = 'eslint'
		} else {
			sh.echo(error('请安装eslint'))
			sh.exit(1)
		}
		if (opt.format) format = '-f ' + opt.format

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
				let list = [],
					output = ''
				if (opt.output) output = `-o report/${key}.html`
				map[key].forEach(el => {
					list.push(el.path)
				})
				cmd.push({
					// cmd: `${eslint} ${list.join(' ')} --ext ${opt.ext} -f /Users/saqqdy/www/saqqdy/eslint-reporter/src/js/reporter.js -o ${key}.html`,
					cmd: `${eslint} ${list.join(' ')} ${opt.quiet ? '--quiet' : ''} --ext ${opt.ext} ${format} ${output}`,
					config: {
						slient: false,
						again: false,
						success: '导出成功',
						fail: '出错了，可能是文件过多'
					}
				})
			}
			// 传入了json配置
			cfg.forEach(el => {})
		} else {
			let output = ''
			if (opt.output) output = '-o ' + opt.output
			cmd.push({
				cmd: `${eslint} ${config.join(' ')} ${opt.quiet ? '--quiet' : ''} --ext ${opt.ext} ${format} ${output}`,
				config: {
					slient: false,
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
	console.log('  $ eslint-reporter init')
	console.log('  $ eslint-reporter --help')
	console.log('  $ eslint-reporter -h')
})

program.parse(process.argv)
