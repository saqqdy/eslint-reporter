# eslint-reporter

支持按模块生成 eslint 报告

## 安装

```
# 通过npm安装
npm install -g eslint-reporter

# 或者通过yarn安装
yarn global add eslint-reporter
```

## 使用

```
# 查看版本
eslint-reporter -v

# 查看帮助信息
eslint-reporter --help
```

## 配置

可传入 ext 和 output 两个参数，ext 指定需要校验的文件类型，output 用以指定输出文件名称，使用 json 文件配置时，默认使用配置文件中的 admin 名称作为导出文件名称

#### 导出指定目录的 eslint 报告

```
# 导出./src/views/basic目录的检测报告到report.html
eslint-reporter ./src/views/basic -o report.html
```

#### 同时导出多个目录

```
# 导出./src/views/basic和./src/libs两个目录的检测报告到report.html
eslint-reporter ./src/views/basic ./src/libs
```
