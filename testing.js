const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json());

const posts = [
    {
        username:'kyle',
        title:'Post 1'
    },
    {
        username:'jim',
        title:'Post 2xs'
    }
]

app.get('/posts',(req,resp)=>{
    resp.json(posts);
})

app.post('/login',(req,resp)=>{
    const username = req.body.username;
    const user = {name:username}
    const accessToken = jwt.sign(user,process.env.ACCESS_SECRET_TOKEN);
    resp.json({accessToken:accessToken});
});

function makeString(length){
    var result = [];
    var characters = '0123456789';
    var charactersLength = characters.length;
    for(var i = 0;i<length;i++){
        result.push(characters.charAt(Math.floor(Math.random()*charactersLength)));
    }
    return result.join('');
    console.log(makeString);
}

console.log(makeString(10));

app.listen(3000);