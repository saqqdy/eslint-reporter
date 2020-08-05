#!/usr/bin/env node
const set = require('./../package.json')
const path = require('path')
const cwd = process.cwd()
const ora = require('ora')
const program = require('commander')
const sh = require('shelljs')
const { error, queue, success } = require('./utils')

program.version('v' + set.version + ', powered by saqqdy', '-v, --version', '查看eslint-reporter版本')
program
	.name('eslint-reporter')
	.usage('[config...]')
	.arguments('[config...]')
	.description('导出eslint报告')
	.option('-o, --output [output]', '导出文件名称')
	.option('-e, --ext [ext]', '需要校验的文件类型', '.vue,.js')
	.option('-f, --format [format]', '导出的类型，默认：stylish', '')
	.option('-q, --quiet [quiet]', '只显示问题记录', false)
	.option('--fix [fix]', '修复可自动修复的问题', false)
	.option('-a, --admin [admin]', '负责人名称', '')
	.action(async (config, opt) => {
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
		if (opt.format) format = ' -f ' + opt.format

		if (config.length === 0) {
			// 没有传入配置文件
		} else if (config.length === 1 && /\.json$/.test(config[0])) {
			// 传入json配置文件
			let cfg = require(path.resolve(config[0]))
			map = {}
			cfg.forEach(el => {
				if (opt.admin) {
					let admins = opt.admin.split(',')
					if (!admins.includes(el.admin)) return
				}
				if (!map[el.admin]) map[el.admin] = []
				el.admin && map[el.admin].push(el)
			})
			for (let key in map) {
				let list = [],
					output = ''
				// 默认按名字导出文件，不传admin时output一定导出文件
				if (opt.output) output = ` -o ${path.join(cwd, 'report')}/${key}.html`
				map[key].forEach(el => {
					list.push(el.path)
				})
				cmd.push({
					// cmd: `${eslint} ${list.join(' ')} --ext ${opt.ext} -f /Users/saqqdy/www/saqqdy/eslint-reporter/src/js/reporter.js -o ${key}.html`,
					cmd: `${eslint} ${list.join(' ')}${opt.quiet ? ' --quiet' : ''}${opt.fix ? ' --fix' : ''} --ext ${opt.ext}${format}${output} --color`,
					config: {
						silent: !output ? false : true,
						again: false,
						success: !output ? '处理完成' : '导出成功',
						fail: '出错了，可能是文件过多导致的'
					}
				})
			}
		} else {
			let output = ''
			if (opt.output) output = ' -o ' + (opt.output === true ? `${path.join(cwd, '/')}/report.html` : path.resolve(opt.output))
			cmd.push({
				cmd: `${eslint} ${config.join(' ')}${opt.quiet ? ' --quiet' : ''}${opt.fix ? ' --fix' : ''} --ext ${opt.ext}${format}${output} --color`,
				config: {
					silent: !output ? false : true,
					again: false,
					success: !output ? '处理完成' : '导出成功',
					fail: '出错了，可能是文件过多导致的'
				}
			})
		}
		const spinner = ora(success('处理中')).start()
		await queue(cmd)
		spinner.stop()
	})

// 自定义帮助
program.on('--help', function () {
	console.info('使用案例:')
	console.info('  $ eslint-reporter init')
	console.info('  $ eslint-reporter --help')
	console.info('  $ eslint-reporter -h')
})

program.parse(process.argv)
