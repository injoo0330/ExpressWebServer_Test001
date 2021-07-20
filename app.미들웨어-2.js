const express = require('express');         //==기본
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv'); //dotenv: process.env 관리 위해 설치
const path = require('path');

dotenv.config();
//dotenv 패지키는 .env 파일을 읽어--> process.env로 만든다.
const app = express();                  //== 기본
app.set('port', process.env.PORT||3000);//== 기본 http://localhost:3000

//app.use(morgan('dev')); 
//morgan 사용 가능 인수: combined, common, short, tiny, dev
app.use(morgan('tiny'));
app.use('/', express.static(path.join(__dirname,'public')));
//정적인 파일들을 제공하는 라우터 역할을 한다.
//app.use('요청경로', express.static('실제경로'));
app.use(express.json());    //body-parser 미들웨어 사용
app.use(express.urlencoded({extended: false})); 
//body-parser 미들웨어 사용, false:querystring 모듈, true:qs모듈 사용.
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
})); 
//====== 자주 사용되는 미들웨어 장착 ==========================

//====== multer 미들웨어 장착 ================================


//====== 기본 
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