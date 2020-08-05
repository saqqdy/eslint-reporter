const sh = require('shelljs')
const colors = require('colors')
let pwd = sh.pwd() + '/'
const warning = txt => {
	return colors.yellow(txt)
}
const error = txt => {
	return colors.red(txt)
}
const success = txt => {
	return colors.green(txt)
}

/**
 * wait
 * @description 递归执行程序
 */
const wait = (list, fun) => {
	// 最后一条指令，执行完成之后退出递归
	if (list.length === 0) {
		fun()
		return
	} else {
		fun(list[0], (kill = false) => {
			// 强制中断
			if (kill) return
			list.shift()
			wait(list, fun)
		})
	}
}

/**
 * queue
 * @description 脚本执行主程序
 * @param {Array} list 脚本序列
 */
const queue = list => {
	return new Promise((resolve, reject) => {
		let returns = []
		if (list.length === 0) reject('指令名称不能为空')
		list = JSON.parse(JSON.stringify(list))
		wait(list, (command, cb) => {
			let config = {
					silent: true,
					kill: true,
					async: false,
					again: false // 指令执行中断之后是否需要重新执行，类似冲突解决之后的指令，不再需要重复执行
				},
				cmd = command
			// 传入对象形式：{ cmd: '', config: {} }
			if (command instanceof Object) {
				config = Object.assign(config, command.config || {})
				cmd = command.cmd
			}
			if (!cmd) {
				// 只有一条指令，不需返回数组形式
				resolve(returns)
			} else {
				sh.exec(cmd, config, (code, out, err) => {
					try {
						out = JSON.parse(out)
					} catch (err) {
						out = out.replace(/\n*$/g, '')
					}
					returns.push({ code, out, err, config, cmd })
					cb()
					sh.echo('\r' + success(config.success || '执行成功'))
				})
			}
		})
	})
}

module.exports = { pwd, warning, error, success, wait, queue }
