const express =require('express');
const app=express();
const PORT=8000;



app.set('view engine','ejs');


app.get('/',(req,res)=>{
    res.render('main');
})

app.use('*',(req,res)=>{
    res.render('404');
})

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})