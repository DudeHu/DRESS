#! /bin/bash

pid=`ps -aux | grep 3000 | grep node | awk '{print $2}'`

if [ "${pid}" = '' ]; then
        echo "[FAIL] 不存在任何实例"

else
        kill -9 $pid
        sleep 20
        echo "[OK] kill $pid"
fi