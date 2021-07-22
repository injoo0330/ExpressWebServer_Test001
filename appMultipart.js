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

//====== multer 미들웨어 장착 >================================
const multer = require('multer');
const fs = require('fs');

try{
    fs.readdirSync('uploads');
} catch (error){
    console.error('uploads 촐더가 없어 생성합니다.');
    fs.mkdirSync('uploads');
}
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
            //req 나 file의 데이터를 가공해서 done 으로 넘기는 형식
            //첫번째 인수: 에러가 있다면 에러
            //두번째 인수: 실제 경로나 파일 이름.
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext)+Date.now()+ext);
        },
    }),
    limits: {fileSize: 5*1024*1024},
});
/*<form id="form" action="/upload" method="POST" enctype="multipart/form-data" >
<input type="file" name="image1" />
<input type="file" name="image2" />
<input type="text" name="title" />
<button type="submit" >업로드</button>
</form>
*/
//==>localhost:3000/upload 에 접속하면 <form~ 수행된다.
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'multipart.html'));
});
app.post('/upload',
    upload.fields([{name: 'image1'}, {name: 'image2'}]),
    (req, res)=>{
        console.log(req.files, req.body);
        res.send('ok');
    },
);


//====== 기본 수행 =======================
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
app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기 중!');
});