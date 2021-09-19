#!/usr/bin/env node
'use strict';

typeof require !== "undefined" ? require : (x) => {
  throw new Error('Dynamic require of "' + x + '" is not supported');
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const set = require("./../package.json");
const path = require("path");
const cwd = process.cwd();
const ora = require("ora");
const program = require("commander");
const sh = require("shelljs");
const { error, queue, success } = require("./utils");
program.version("v" + set.version + ", powered by saqqdy", "-v, --version", "\u67E5\u770Beslint-reporter\u7248\u672C");
program.name("eslint-reporter").usage("[config...]").arguments("[config...]").description("\u5BFC\u51FAeslint\u62A5\u544A").option("-o, --output [output]", "\u5BFC\u51FA\u6587\u4EF6\u540D\u79F0").option("-e, --ext [ext]", "\u9700\u8981\u6821\u9A8C\u7684\u6587\u4EF6\u7C7B\u578B", ".vue,.js").option("-f, --format [format]", "\u5BFC\u51FA\u7684\u7C7B\u578B\uFF0C\u9ED8\u8BA4\uFF1Astylish", "").option("-q, --quiet [quiet]", "\u53EA\u663E\u793A\u95EE\u9898\u8BB0\u5F55", false).option("--fix [fix]", "\u4FEE\u590D\u53EF\u81EA\u52A8\u4FEE\u590D\u7684\u95EE\u9898", false).option("-a, --admin [admin]", "\u8D1F\u8D23\u4EBA\u540D\u79F0", "").action((config, opt) => __async(undefined, null, function* () {
  let cmd = [], eslint = "", format = "";
  if (sh.which("./node_modules/eslint/bin/eslint.js")) {
    eslint = "./node_modules/eslint/bin/eslint.js";
  } else if (sh.which("eslint")) {
    eslint = "eslint";
  } else {
    sh.echo(error("\u8BF7\u5B89\u88C5eslint"));
    sh.exit(1);
  }
  if (opt.format)
    format = " -f " + opt.format;
  if (config.length === 0) ; else if (config.length === 1 && /\.json$/.test(config[0])) {
    let cfg = require(path.resolve(config[0])), map = {};
    cfg.forEach((el) => {
      if (opt.admin) {
        let admins = opt.admin.split(",");
        if (!admins.includes(el.admin))
          return;
      }
      if (!map[el.admin])
        map[el.admin] = [];
      el.admin && map[el.admin].push(el);
    });
    for (let key in map) {
      let list = [], output = "";
      if (opt.output)
        output = ` -o ${path.join(cwd, "report")}/${key}.html`;
      map[key].forEach((el) => {
        list.push(el.path);
      });
      cmd.push({
        cmd: `${eslint} ${list.join(" ")}${opt.quiet ? " --quiet" : ""}${opt.fix ? " --fix" : ""} --ext ${opt.ext}${format}${output} --color`,
        config: {
          silent: !output ? false : true,
          again: false,
          success: !output ? "\u5904\u7406\u5B8C\u6210" : "\u5BFC\u51FA\u6210\u529F",
          fail: "\u51FA\u9519\u4E86\uFF0C\u53EF\u80FD\u662F\u6587\u4EF6\u8FC7\u591A\u5BFC\u81F4\u7684"
        }
      });
    }
  } else {
    let output = "";
    if (opt.output)
      output = " -o " + (opt.output === true ? `${path.join(cwd, "/")}/report.html` : path.resolve(opt.output));
    cmd.push({
      cmd: `${eslint} ${config.join(" ")}${opt.quiet ? " --quiet" : ""}${opt.fix ? " --fix" : ""} --ext ${opt.ext}${format}${output} --color`,
      config: {
        silent: !output ? false : true,
        again: false,
        success: !output ? "\u5904\u7406\u5B8C\u6210" : "\u5BFC\u51FA\u6210\u529F",
        fail: "\u51FA\u9519\u4E86\uFF0C\u53EF\u80FD\u662F\u6587\u4EF6\u8FC7\u591A\u5BFC\u81F4\u7684"
      }
    });
  }
  const spinner = ora(success("\u5904\u7406\u4E2D")).start();
  yield queue(cmd);
  spinner.stop();
}));
program.on("--help", function() {
  console.info("\u4F7F\u7528\u6848\u4F8B:");
  console.info("  $ eslint-reporter init");
  console.info("  $ eslint-reporter --help");
  console.info("  $ eslint-reporter -h");
});
program.parse(process.argv);
