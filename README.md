
###1.Initialition

a.Install server / release module. (安装服务器及发版模块)

npm install nobox -g
npm install bower -g

b.Install seekjs script for build tools. (安装seekjs脚手架构建工具)

npm install seek-cli -g

c.Install uglifyjs for compress code.(安装代码压缩工具)

npm install uglifyjs -g

d.Install local module. (安装本地模块)

bower install

npm install 或 npm run taobao (适用于国内)

e.Initialization script of run.(运行初始化脚本)

npm run init

###2.Run
nobox start

###3.Build and Run
seek build test
nobox start --bin

###4.Release
nobox pub test


