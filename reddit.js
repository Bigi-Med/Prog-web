const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const port = 3000

const session = require('express-session'); 
const { openDb } = require('./db');
const SQLiteStore = require('connect-sqlite3')(session);


const sess = {
    store: new SQLiteStore,
    secret: 'secret key',
    resave: true,
    rolling: true,
    cookie:{
        maxAge: 1000*3600 // ms
    },
    saveUninitialized: true
}
app.use(session(sess))

app.use(bodyParser.json());  // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));  // support encoded bodies

app.set('views', './views');
app.set('view engine', 'jade');

let fields= [] // array will containe our database 024 135
let max = 1 // max lines in database

app.get("/",async(req,res) => {
    const db = await openDb()  
        
    const post = await db.all(' SELECT * FROM IDENTIFICATION ')
   //console.log(post) //print out database
   if(req.session.login){
        res.render('accueil')
   }
    else{        
        res.render("inscription",{login : req.session.login})
    }


    
})




app.get("/create_account",(req,res)=>{
    
    res.render("new_account",{})
})



app.post("/insert",async(req,res)=>{

    
    const db = await openDb()
    const email = req.body.mail
    const pseudo_name = req.body.pseudo
    const acc_pass = req.body.pass
    length_pass = acc_pass.length
    length_pseudo = pseudo_name.length

    if(length_pass >= 6 && length_pseudo <=4 ){
        db.run('INSERT INTO  IDENTIFICATION(email,pseudo,password) VALUES(?,?,?)',[email,pseudo_name,acc_pass])
        res.redirect(302,"/")
    }
    else {
        if((length_pass < 6) && (length_pseudo <= 4) ){
            data ={
                error_pass : "password must have at least 6 characters"
            }
            res.render("new_account",data)
            return
            data ={} //reset object for next query
        }
        if ((length_pseudo > 4) && (length_pass >= 6)){
            data ={
                error_pseudo : "pseudo name must not exceed 4 characters"
            }
            res.render("new_account",data)
            return
            data = {} //reset object for next query
        }
        if ((length_pseudo > 4) && (length_pass < 6))
            data ={
                error_pseudo : "pseudo name must not exceed 4 characters",
                error_pass : "password must have at least 6 characters"
            }
            
            res.render("new_account",data)
            return
            data={} //reset object for next query
            
            
    }
})

app.post("/login",async(req,res)=>{
    const db = await openDb()
    
    const post = await db.all(' SELECT * FROM IDENTIFICATION ')
    
    // filling the fields array
    for(i=0;i<max;i++)
    {
        fields.push(post[i].email)
    }
    for(i=0;i<max;i++)
    {
        fields.push(post[i].pseudo)
    }
    for(i=0;i<max;i++)
    {
        fields.push(post[i].password)
    }
    for(i=0;i<max;i++)
    {
        fields.push(post[i].pseudo_id)
    }

    //console.log(fields) print out the data base in an array
    
    const ins_email = req.body.ins_mail
    const ins_pseudo_name = req.body.ins_pseudo
    const ins_acc_pass = req.body.ins_pass
    
    //const posts = await db.all('SELECT * FROM IDENTIFICATION WHERE ins_email IN(email)')

    for(i=0;i<fields.length;i++)
    {
        if( (ins_email == fields[i]) && (ins_pseudo_name == fields[max+i] )&& (ins_acc_pass == fields[max*2+i]))
        {
            req.session.login = true
            data ={
                login : true,
                d_mail  : ins_email,
                d_pseudo : ins_pseudo_name,
                d_pass : ins_acc_pass
            }
            res.redirect(302,'/')
            break
        } 

        else {
            
            if (i < max-1)
            {
                continue
            }
            else {
                
                data = {
                    login : false
                }
            res.render("new_account")
            }
        }
    }
})
app.get('/logout',(req,res)=>{
    req.session.login = false
    res.redirect(302,"/")
})


app.listen(port,() => {
    console.log("Listening on port ", port)
})