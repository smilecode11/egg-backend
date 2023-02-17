#!/bin/bash

# shell脚本中发生错误，即命令返回值不等于0，则停止执行并退出shell
set -e

mongosh <<EOF
use admin
db.auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD')
use mongoTest2
db.createUser({
  user:  '$MONGO_DB_USERNAME',
  pwd: '$MONGO_DB_PASSWORD',
  roles: [{
    role: 'readWrite',
    db: 'mongoTest2'
  }]
})
db.createCollection('works')
db.works.insertMany([
    {
        "title" : "作品新增测试@装饰器验证用户输入",
        "desc" : "未命名作品",
        "coverImg" : "https://static.imooc-lego.com/upload-files/screenshot-480853.png",
        isTemplate: true,
        isPublic: true
    }
])
EOF
