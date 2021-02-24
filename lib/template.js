//refactoring
module.exports = {//함수를 객체 안에 넣었다.
    html:function(title, list, body, control){
      return `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>  <!--query string에 따라 바꾸고 싶은 부분-->
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        ${body}
      </body>
      </html>
      `;
    },
    list:function(fileList){
      var list = '<ul>';
    
      var i = 0;
      while(i < fileList.length){
        list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
        i++;
      }
      list += '</ul>';
    
      return list;
    }
    
  }
