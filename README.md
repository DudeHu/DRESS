
###1.初始化
a.安装服务器及发版模块
npm install nobox -g

b.安装seekjs脚手架构建工具
npm install seek-cli -g

c.安装代码压缩工具
npm install uglifyjs -g

d.安装本地模块
npm install 或 npm run taobao (适用于国内)

e.运行初始化脚本
npm run init

###2.运行
nobox start java=bihai

###3.构建及运行
seek build test
nobox start --bin

###4.发版
nobox pub test


