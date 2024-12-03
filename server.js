const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');

const sessionOptions = {
    secret : "hashhash@123", 
    resave: false, 
    saveUninitialized: true
};

app.use(session(sessionOptions));

app.use(cookieParser());

app.get('/',(req,res) => {
    res.cookie('name','Nishit');
    res.cookie('email','xyz@gmail.com');
    console.log(req.cookies);

    if(req.session.count){
        req.session.count++;
    } else {
        req.session.count = 1;
    }

    res.send(`req was sent ${req.session.count} times`);
});

app.listen(3000, () => {
    console.log('server is running');
})