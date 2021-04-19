const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs')

let user = {
    admin:123456
}
http.createServer((req,res)=>{
    //获取数据
    let path,getmyurl,post
    if (req.method == 'GET') {
        /* url 模块中的url.parse方法已经被废弃了*/
        //let { pathname, query } = url.parse(req.url, true)
        getmyurl = new URL('http://localhost:8080' + req.url);
        path = getmyurl.pathname
        //console.log('http://localhost:8080'+req.url);
        //console.log(path);
        //console.log(getmyurl.searchParams.get('username'));
        complete()
    }else if (req.method == 'POST') {
        let arr = [];
        path = req.url
        console.log(path);
        req.on('data', buffer => {
            arr.push(buffer);
        })
        req.on('end', () => {
            post = querystring.parse(Buffer.concat(arr).toString());//最后处理为json格式 如果有文件，这里不能直接使用toString
            complete()
        })
        
    }

    function complete () {
        
        if (path == '/login') {
            res.writeHead(200, {
                "Content-Type":"text/plain;charset=utf-8"
            })
            let username = getmyurl.searchParams.get('username')
            let password = getmyurl.searchParams.get('password');//接下来应该是判断数据库里有没有
            if (!user[username]) {
                
                res.end(JSON.stringify({
                    err: 1,
                    msg:"用户名不存在"
                }))
            } else if (user[username] != password) {
                res.end(JSON.stringify({
                    err: 1,
                    msg:"密码错误"
                }))
            } else {
                res.end(JSON.stringify({
                    err: 0,
                    msg:"登录成功"
                }))
            }
        } else if (path == '/regist') {
            res.writeHead(200, {
                "Content-Type":"text/plain;charset=utf-8"
            })
            let {username,password} = post
            if (user[username]) {
                res.end(JSON.stringify({
                    err: 1,
                    msg:"用户已存在"
                }))
            } else {
                user[username] = password
                res.end(JSON.stringify({
                    err: 0,
                    msg:"注册成功"
                }))
            }
        } else {
            fs.readFile(`src${path}`, (err,data)=>{
                if (err) {
                    res.end('404')
                } else {
                    res.end(data)
                }
            })
        }
    }
}).listen(8080, () => {
    console.log('服务启动成功');
})