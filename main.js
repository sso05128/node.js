var http = require('http');
var fs = require('fs');
var url = require('url'); //url노드를 사용할 수 있는 url모듈
var qs = require('querystring');//querystring이라는 nodejs가 가지고 있는 모듈을 가지고 온다.
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;//url값 가져오기  /?id=css
    var queryData = url.parse(_url, true).query;//{id:'css'}
    console.log(queryData.id);//css
    // console.log(url.parse(_url, true));
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){/*초기화면 설정 */
      if(queryData.id === undefined){/*초기화면과 html,css,js의 pathname은 /으로 동일하므로 구분해줘야 한다. */
      
        fs.readdir('data', function(error, fileList){
          var title = 'Welcome';
          var description = 'Hello, Node.js';

          var list = template.list(fileList);

          var html = template.html(title,list, `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(html); //사용자가 접속한 url에 따라 파일 읽어주는 코드. 화면 출력
  
        });

      }
      else{
        fs.readdir('data', function(error, fileList){
          var filteredPath = path.parse(queryData.id).base;//?id=../password.js
          fs.readFile(`data/${filteredPath}`, 'utf-8', function(err, description){
            var title = queryData.id;

            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description);

            var list = template.list(fileList);

            var html = template.html(sanitizedTitle,list,
               `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            `<a href="/create">create</a> 
            <a href='/update?id=${sanitizedTitle}'>update</a>
            <form action="delete_process" method="post"><!--onsubmit으로 삭제하기 전 물어보는 알림 설정-->
              <input type="hidden" name="id", value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>`);
            response.writeHead(200);
            response.end(html); //사용자가 접속한 url에 따라 파일 읽어주는 코드. 화면 출력
          });
        });

      }
    }
    else if(pathname === '/create'){
      fs.readdir('data', function(error, fileList){
        var title = 'WEB - create';

        var list = template.list(fileList);

        var html = template.html(title,list, `
        <form action="http://localhost:3000/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `, '');
        response.writeHead(200);
        response.end(html); //사용자가 접속한 url에 따라 파일 읽어주는 코드. 화면 출력

      });
    }
    else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){//들어올 정보가 더 이상 없을 경우
        var post = qs.parse(body);//querystring모듈의 parse함수로 정보 객체화
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end('');
            
        });
      });

    }
    else if(pathname === '/update'){
      fs.readdir('data', function(error, fileList){
        var filteredPath = path.parse(queryData.id).base;//?id=../password.js
        fs.readFile(`data/${filteredPath}`, 'utf-8', function(err, description){
          var title = queryData.id;

          var list = template.list(fileList);

          var html = template.html(title,list,
             `
              <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
             <p><input type="text" name="title" value="${title}"></p>
             <p>
               <textarea name="description" value="${description}"></textarea>
             </p>
             <p>
               <input type="submit">
             </p>
           </form>
             `,//update의 ui생성
          `<a href="/create">create</a> <a href='/update?id=${title}'>update</a>`);
          response.writeHead(200);
          response.end(html); //사용자가 접속한 url에 따라 파일 읽어주는 코드. 화면 출력
        });
      });
    }
    else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){//들어올 정보가 더 이상 없을 경우
        var post = qs.parse(body);//querystring모듈의 parse함수로 정보 객체화
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`,`data/${title}`,function(err){
          fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end('');
              
          });
        });
      });

    }
    else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){//들어올 정보가 더 이상 없을 경우
        var post = qs.parse(body);//querystring모듈의 parse함수로 정보 객체화
        var id = post.id;
        var filteredPath = path.parse(id).base;//?id=../password.js
        fs.unlink(`data/${filteredPath}`, function(err){
          response.writeHead(302, {Location: `/`});
          response.end('');
        });

      });

    }
    else{
      response.writeHead(404);
      response.end('Not found');
    }


   
    //console.log(__dirname+_url);


});
app.listen(3000);