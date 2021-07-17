const express = require('express'); 
//express 내부에 http모듈이 내장되어 있음.
const app = express();
app.set('port', process.env.PORT||3000);//http://localhost:3000

app.get('/', (req, res)=>{
    res.send('Hello, Express');
});

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기 중!');
});