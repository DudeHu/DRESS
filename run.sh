#! /bin/bash

old_pid=`ps -aux | grep 3000| grep node | awk '{print $2}'`

if [ "${old_pid}" = '' ]; then
    cd
    seek build test
    cp -R ./bower_components ./dist/bower_components
    nohup nobox start port=3000 env=test  >> /website/dress/logs/node.log  2>&1 &
        #node /usr/local/bin/nobox pub_server port=3000 dir=/website/dress/dist env=test &
        sleep 5
        new_pid=`ps -aux | grep 3000| grep node | awk '{print $2}'`
        echo "[OK] pid: ${new_pid}"
else
        echo "[FAIL] 已经存在一个实例了，不要重复运行, pid: ${old_pid}"

fi