const express = require('express'); 
//express 내부에 http모듈이 내장되어 있음.
const path = require('path');
const app = express();
app.set('port', process.env.PORT||3000);//http://localhost:3000

app.use((req, res, next)=>{
    console.log('모든 요청에 다 실행됩니다.');
    next();
});
app.get('/',(req, res, next)=>{
    console.log('GET / 요청에서만 실행됩니다.');
    next();
}, (req, res)=>{
    throw new Error('에러는 에러 처리 미들 웨어로 간다.');
});
app.use((err, req, res, next)=>{
    console.error(err);
    res.status(500).send(err.message);
});
//미들웨어 사용 전 서버 작동 확인
//app.get('/', (req, res)=>{
    //res.send('Hello, Express');
//    res.sendFile(path.join(__dirname, '/index.html'));
//});

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기 중!');
});