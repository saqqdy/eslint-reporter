'use strict';

const sh = require("shelljs");
const colors = require("colors");
let pwd = sh.pwd() + "/";
function warning(txt) {
  return colors.yellow(txt);
}
function error(txt) {
  return colors.red(txt);
}
function success(txt) {
  return colors.green(txt);
}
function wait(list, fun) {
  if (list.length === 0) {
    fun();
    return;
  } else {
    fun(list[0], (kill = false) => {
      if (kill)
        return;
      list.shift();
      wait(list, fun);
    });
  }
}
const queue = (list) => {
  return new Promise((resolve, reject) => {
    const returns = [];
    if (list.length === 0)
      reject("\u6307\u4EE4\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A");
    list = JSON.parse(JSON.stringify(list));
    wait(list, (command, cb) => {
      let config = {
        silent: true,
        kill: true,
        async: false,
        again: false
      }, cmd = command;
      if (command instanceof Object) {
        config = Object.assign(config, command.config || {});
        cmd = command.cmd;
      }
      if (!cmd) {
        resolve(returns);
      } else {
        sh.exec(cmd, config, (code, out, err) => {
          try {
            out = JSON.parse(out);
          } catch (err2) {
            out = out.replace(/\n*$/g, "");
          }
          returns.push({ code, out, err, config, cmd });
          cb && cb();
          sh.echo("\r" + success(config.success || "\u6267\u884C\u6210\u529F"));
        });
      }
    });
  });
};
module.exports = { pwd, warning, error, success, wait, queue };
