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
        "title" : "作品新增测试@装饰器验证用户输入",
        "desc" : "未命名作品",
        "coverImg" : "https://static.imooc-lego.com/upload-files/screenshot-480853.png",
        "content" : {
            "components" : [ 
                {
                    "name" : "l-image",
                    "props" : {
                        "imageSrc" : "https://static.imooc-lego.com/upload-files/%E6%85%95%E8%AF%BE%E7%BD%91%20%E9%80%8F%E6%98%8ELOGO(%E7%BA%AFlogo)-629888.png",
                        "actionType" : "",
                        "url" : "",
                        "height" : "65px",
                        "width" : "81px",
                        "paddingLeft" : "0px",
                        "paddingRight" : "0px",
                        "paddingTop" : "0px",
                        "paddingBottom" : "0px",
                        "borderStyle" : "none",
                        "borderColor" : "#000",
                        "borderWidth" : "0",
                        "borderRadius" : "0",
                        "boxShadow" : "0 0 0 #000000",
                        "opacity" : 1,
                        "position" : "absolute",
                        "left" : "269px",
                        "top" : "24px",
                        "right" : "0"
                    },
                    "id" : "c80ce964-42dc-4b01-9b01-56370bd650cd",
                    "layerName" : "图层2",
                    "isHidden" : false,
                    "isLocked" : false
                }, 
                {
                    "name" : "l-text",
                    "props" : {
                        "text" : "保持开心",
                        "fontSize" : "60px",
                        "fontFamily" : "\"SimHei\",\"STHeiti\"",
                        "fontWeight" : "bold",
                        "fontStyle" : "italic",
                        "textDecoration" : "none",
                        "lineHeight" : "1",
                        "textAlign" : "center",
                        "color" : "#ffffff",
                        "backgroundColor" : "",
                        "actionType" : "",
                        "url" : "",
                        "height" : "85px",
                        "width" : "266px",
                        "paddingLeft" : "0px",
                        "paddingRight" : "0px",
                        "paddingTop" : "0px",
                        "paddingBottom" : "0px",
                        "borderStyle" : "none",
                        "borderColor" : "#000",
                        "borderWidth" : "0",
                        "borderRadius" : "0",
                        "boxShadow" : "0 0 0 #000000",
                        "opacity" : 1,
                        "position" : "absolute",
                        "left" : "45.5px",
                        "top" : "124px",
                        "right" : "0",
                        "tag" : "h2"
                    },
                    "id" : "19d06640-d30e-484f-aadc-f10b8d141b62",
                    "layerName" : "图层3"
                }, 
                {
                    "name" : "l-text",
                    "props" : {
                        "text" : "你可以听很丧的歌\n但我 希望你看看外面的太阳、\n星星 月亮 行人\n数目 花香 雨滴 动物 \n看到 这个世界上也是有亮晶晶的\n保持开心呀 ~\n早安~",
                        "fontSize" : "14px",
                        "fontFamily" : "\"SimHei\",\"STHeiti\"",
                        "fontWeight" : "normal",
                        "fontStyle" : "normal",
                        "textDecoration" : "none",
                        "lineHeight" : "2.1",
                        "textAlign" : "left",
                        "color" : "#ffffff",
                        "backgroundColor" : "#f5222d",
                        "actionType" : "",
                        "url" : "",
                        "height" : "189px",
                        "width" : "261px",
                        "paddingLeft" : "0px",
                        "paddingRight" : "0px",
                        "paddingTop" : "0px",
                        "paddingBottom" : "0px",
                        "borderStyle" : "none",
                        "borderColor" : "#000",
                        "borderWidth" : "0",
                        "borderRadius" : "0",
                        "boxShadow" : "0 0 0 #000000",
                        "opacity" : 1,
                        "position" : "absolute",
                        "left" : "49px",
                        "top" : "238px",
                        "right" : "0",
                        "tag" : "p"
                    },
                    "id" : "65f51a06-ec24-4bf9-a61b-b30148ccf8c4",
                    "layerName" : "图层4"
                }, 
                {
                    "name" : "l-image",
                    "props" : {
                        "imageSrc" : "https://static.imooc-lego.com/upload-files/%E4%BA%8C%E7%BB%B4%E7%A0%81-876236.png",
                        "actionType" : "",
                        "url" : "",
                        "height" : "96px",
                        "width" : "92.5px",
                        "paddingLeft" : "0px",
                        "paddingRight" : "0px",
                        "paddingTop" : "0px",
                        "paddingBottom" : "0px",
                        "borderStyle" : "none",
                        "borderColor" : "#000",
                        "borderWidth" : "0",
                        "borderRadius" : "0",
                        "boxShadow" : "0 0 0 #000000",
                        "opacity" : 1,
                        "position" : "absolute",
                        "left" : "24px",
                        "top" : "554px",
                        "right" : "0"
                    },
                    "id" : "3573e2a5-7312-4e82-a28a-8e26daf05ee2",
                    "layerName" : "图层5"
                }, 
                {
                    "name" : "l-text",
                    "props" : {
                        "text" : "2020/11.23 \n星期一 \n\n",
                        "fontSize" : "21px",
                        "fontFamily" : "\"SimHei\",\"STHeiti\"",
                        "fontWeight" : "normal",
                        "fontStyle" : "normal",
                        "textDecoration" : "none",
                        "lineHeight" : "1.5",
                        "textAlign" : "center",
                        "color" : "#f5222d",
                        "backgroundColor" : "",
                        "actionType" : "",
                        "url" : "",
                        "height" : "69px",
                        "width" : "119.5px",
                        "paddingLeft" : "0px",
                        "paddingRight" : "0px",
                        "paddingTop" : "0px",
                        "paddingBottom" : "0px",
                        "borderStyle" : "none",
                        "borderColor" : "#000",
                        "borderWidth" : "0",
                        "borderRadius" : "0",
                        "boxShadow" : "0 0 0 #000000",
                        "opacity" : 1,
                        "position" : "absolute",
                        "left" : "70px",
                        "top" : "54px",
                        "right" : "0",
                        "tag" : "p"
                    },
                    "id" : "61349937-e72a-4863-8b32-e2eba1df0695",
                    "layerName" : "图层1副本副本"
                }
            ],
            "props" : {
                "backgroundColor" : "#ffffff",
                "backgroundImage" : "url('https://static.imooc-lego.com/upload-files/%E5%B9%BC%E5%84%BF%E5%9B%AD%E8%83%8C%E6%99%AF%E5%9B%BE-994372.jpg')",
                "backgroundRepeat" : "no-repeat",
                "backgroundSize" : "cover",
                "height" : "666.6666666666666px"
            }
        }
    }
])
EOF