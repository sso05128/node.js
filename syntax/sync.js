var fs = require('fs');
/*동기적
console.log('A');
var result = fs.readFileSync('./syntax/sample.txt', 'utf-8');
console.log(result);
console.log('C');
*/

//비동기적
console.log('A');
fs.readFile('./syntax/sample.txt', 'utf-8',     function(err, result){
    console.log(result);
});
//nodejs가 파일 읽고 3번째 인자인 함수 내부적으로 호출.
//function안에 코드들 처리된다. callback(나중에 전화해라)
console.log('C');
