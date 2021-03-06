    //方式一：引入http模块  
    /*
    var http = require('http'),  
        //创建一个服务器  
        server = http.createServer(function(req, res) {  
            res.writeHead(200, {  
                //'Content-Type': 'text/plain' 
                'Content-Type': 'text/html'
            });  
            res.write('<h1>hello world!</h1>'); //返回HTML标签   
            res.end();  
        });  
    //监听80端口  
    server.listen(80);  
    console.log('server started'); 
    */
    
    //方式二：引入express模块
        //服务器及页面响应部分  
    var express = require('express'),  
        app = express(),  
        server = require('http').createServer(app),  
        io = require('socket.io').listen(server), //引入socket.io模块并绑定到服务器
        users=[];
    app.use('/', express.static(__dirname + '/www'));  
    server.listen(80);  
     
    //socket部分  
    io.on('connection', function(socket) {  
         //昵称设置  
			    socket.on('login', function(nickname) {  
			        if (users.indexOf(nickname) > -1) {  
			            socket.emit('nickExisted');  
			        } else {  			        	 
			            socket.userIndex = users.length; 			           
			            console.log('userIndex:'+socket.userIndex);
			            socket.nickname = nickname;  
			            users.push(nickname);  
			            socket.emit('loginSuccess');  
			            //io.sockets.emit('system', nickname); //向所有连接到服务器的客户端发送当前登陆用户的昵称   
			            io.sockets.emit('system', nickname, users.length, 'login'); 
			        };  
          }); 
          
          //监听断开连接事件
          socket.on('disconnect', function() {  
					    //将断开连接的用户从users中删除  
					    console.log('userIndex:'+socket.userIndex);
					    users.splice(socket.userIndex, 1);  
					    //通知除自己以外的所有人  
					    socket.broadcast.emit('system', socket.nickname, users.length, 'logout');  
					});  
					
					//接收新消息  
			    socket.on('postMsg', function(msg) {  
			        //将消息发送到除自己外的所有用户  
			        socket.broadcast.emit('newMsg', socket.nickname, msg);  
			    });
			    
			     //接收用户发来的图片  
			     socket.on('img', function(imgData) {  
			        //通过一个newImg事件分发到除自己外的每个用户  
			         socket.broadcast.emit('newImg', socket.nickname, imgData);  
			     });  
    });
    console.log('server started');
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    