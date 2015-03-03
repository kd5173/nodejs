    //��ʽһ������httpģ��  
    /*
    var http = require('http'),  
        //����һ��������  
        server = http.createServer(function(req, res) {  
            res.writeHead(200, {  
                //'Content-Type': 'text/plain' 
                'Content-Type': 'text/html'
            });  
            res.write('<h1>hello world!</h1>'); //����HTML��ǩ   
            res.end();  
        });  
    //����80�˿�  
    server.listen(80);  
    console.log('server started'); 
    */
    
    //��ʽ��������expressģ��
        //��������ҳ����Ӧ����  
    var express = require('express'),  
        app = express(),  
        server = require('http').createServer(app),  
        io = require('socket.io').listen(server), //����socket.ioģ�鲢�󶨵�������
        users=[];
    app.use('/', express.static(__dirname + '/www'));  
    server.listen(80);  
     
    //socket����  
    io.on('connection', function(socket) {  
         //�ǳ�����  
			    socket.on('login', function(nickname) {  
			        if (users.indexOf(nickname) > -1) {  
			            socket.emit('nickExisted');  
			        } else {  			        	 
			            socket.userIndex = users.length; 			           
			            console.log('userIndex:'+socket.userIndex);
			            socket.nickname = nickname;  
			            users.push(nickname);  
			            socket.emit('loginSuccess');  
			            //io.sockets.emit('system', nickname); //���������ӵ��������Ŀͻ��˷��͵�ǰ��½�û����ǳ�   
			            io.sockets.emit('system', nickname, users.length, 'login'); 
			        };  
          }); 
          
          //�����Ͽ������¼�
          socket.on('disconnect', function() {  
					    //���Ͽ����ӵ��û���users��ɾ��  
					    console.log('userIndex:'+socket.userIndex);
					    users.splice(socket.userIndex, 1);  
					    //֪ͨ���Լ������������  
					    socket.broadcast.emit('system', socket.nickname, users.length, 'logout');  
					});  
					
					//��������Ϣ  
			    socket.on('postMsg', function(msg) {  
			        //����Ϣ���͵����Լ���������û�  
			        socket.broadcast.emit('newMsg', socket.nickname, msg);  
			    });
			    
			     //�����û�������ͼƬ  
			     socket.on('img', function(imgData) {  
			        //ͨ��һ��newImg�¼��ַ������Լ����ÿ���û�  
			         socket.broadcast.emit('newImg', socket.nickname, imgData);  
			     });  
    });
    console.log('server started');
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    