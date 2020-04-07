# eslint-reporter
支持按模块生成eslint报告

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
可传入ext和output两个参数，ext指定需要校验的文件类型，output用以指定输出文件名称，使用json文件配置时，默认使用配置文件中的admin名称作为导出文件名称

#### 导出指定目录的eslint报告
```
# 导出./src/views/basic目录的检测报告到report.html
eslint-reporter ./src/views/basic -o report.html
```


#### 同时导出多个目录
```
# 导出./src/views/basic和./src/libs两个目录的检测报告到report.html
eslint-reporter ./src/views/basic ./src/libs
```
