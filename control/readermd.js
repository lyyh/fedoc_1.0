/*
* 文件目录读取
* 封传梼
* 825804189@qq.com
*/

var fs = require('fs')


//遍历文件夹，获取所有文件夹里面的文件信息
/*
 * @param path 路径
 *
 */

function getFileList(path)
{
   var filesList = [];
   var targetObj = {};
   readFile(path,filesList,targetObj);
   return filesList;
}

//遍历读取文件
function readFile(path,filesList,targetObj)
{
    files = fs.readdirSync(path);//需要用到同步读取
    files.forEach(walk);
   function walk(file)
   {  
       //获取文件格式
        states = fs.statSync(path+'/'+file);    
        if(file==".DS_Store"||file==".git") return; //过滤mac上的特殊文件 
        if(states.isDirectory()){
            var item;
            if(targetObj["children"]){
                item = {name:file,children:[]};
                targetObj["children"].push(item);
            }
            else{
               item = {name:file,children:[]};
               filesList.push(item);
            }
            readFile(path+'/'+file,filesList,item);
        }else{   
            //创建一个对象保存信息
            var obj = new Object();
            obj.size = states.size;//文件大小，以字节为单位
            obj.name = file;//文件名
            obj.path = path+'/'+file; //文件绝对路径

            if(targetObj["children"]){
               var item = {name:file,value:obj.path}
               targetObj["children"].push(item);
            }
            else{
                var item = {name:file,value:obj.path};
                filesList.push(item);
            }
        }     
    }
}

// 接口函数
function mapfile(){
	var filesList = getFileList("doc");
	var str = JSON.stringify(filesList);
	// str = "{name:'Egret','children':#1}".replace("#1",str);
	return str;
}

module.exports = mapfile;
