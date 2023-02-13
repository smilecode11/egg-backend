#!/bin/bash
# shell 脚本中发生错误, 即命令返回值不等于 0, 则停止执行并退出 shell
set -e

mongo <<EOF
use admin
db.auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD')
use mongoTest2
db.createUser({
    user: '$MONGO_DB_USERNAME',
    pwd: '$MONGO_DB_PASSWORD',
    roles: [{ role: 'readWrite', db: 'mongoTest2' }]
})
db.createCollection('works')
db.works.insertMany([
    {
        id: '19',
        title: '1024 程序员日',
        desc: '1024 程序员日'
    }
])
EOF