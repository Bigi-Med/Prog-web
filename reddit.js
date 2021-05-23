const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const port = 3000

const session = require('express-session'); 
const { openDb } = require('./db');
const SQLiteStore = require('connect-sqlite3')(session);

app.use(express.static('Prog-web'));

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


var table = []
var old_max = 0
var profile_posts = []
var date_ob = new Date()
var date = ("0" + date_ob.getDate()).slice(-2)
var year = date_ob.getFullYear();
var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
var hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();
var full_date =  date +"/" + month + "/" + year +"," + hours +":" + minutes + ":" +seconds

app.get("/",async(req,res) => {
    const db = await openDb()  
    
    if(req.session.login){
    
    a_post = await db.all('SELECT post FROM POST ')
    a_comment = await db.all('SELECT comment FROM COMMENT') 
    the_date = await db.all('SELECT post_date FROM POST')
    id = await db.all('SELECT MAX(id) as maxID FROM POST')
    id_current = await db.all('SELECT MAX(id) as maxID_user FROM TEMP')
    current_user = await db.all('SELECT user FROM TEMP WHERE id =?',[id_current[0].maxID_user])
    notif_post = await db.all('SELECT post_owner FROM POST ')
    
    if(a_post[0]){
        user = await db.all('SELECT post_owner FROM POST')
    }else{
        user = await db.all('SELECT user FROM TEMP')
    }
    if(a_comment[0]){
        user_comm = await db.all('SELECT comment_owner FROM COMMENT')
    }else{
        user_comm = await db.all('SELECT user FROM TEMP')
    }

 
    for(var i=old_max;i<id[0].maxID;i++)
    {
      
        if (i == null)
        {
            table.unshift(0)
        } else{
            table.unshift(i)
        }
       
    }
    
    old_max = id[0].maxID
    data_1 = {
        the_post : a_post,
        the_comment : a_comment,
        posts_number : id,
        list : table,
        the_user : user,
        the_user_comm : user_comm,
        current_date : the_date,
        my_user : current_user,
        notif_post_user : notif_post
        
    }
    
    res.render("accueil",data_1)
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

    if(length_pass >= 6 && length_pseudo >=4 ){
        db.run('INSERT INTO  EMAIL (email ) VALUES(?)',[email])
        db.run('INSERT INTO  PSEUDO (pseudo ) VALUES(?)',[pseudo_name])
        db.run('INSERT INTO  PASSWORD  (password ) VALUES(?)',[acc_pass])
        res.redirect(302,"/")
    }
    else {
        if((length_pass < 6) && (length_pseudo >= 4) ){
            data ={
                error_pass : "password must have at least 6 characters"
            }
            res.render("new_account",data)
            data = {}
            return
            
        }
        if ((length_pseudo < 4) && (length_pass >= 6)){
            data ={
                error_pseudo : "pseudo name must have at least  4 characters"
            }
            res.render("new_account",data)
            data = {} //reset object for next query
            return
            
        }
        if ((length_pseudo < 4) && (length_pass < 6))
            data ={
                error_pseudo : "pseudo name must not exceed 4 characters",
                error_pass : "password must have at least 6 characters"
            }
            
            res.render("new_account",data)
            data={} //reset object for next query
            return
     }
})

app.post("/login",async(req,res)=>{
    const db = await openDb()
    const ins_email = req.body.ins_mail
    const ins_pseudo_name = req.body.ins_pseudo
    const ins_acc_pass = req.body.ins_pass
    
    let email_id = await db.all(' SELECT id FROM EMAIL WHERE email = ?',[ins_email]) 
    let pseudo_id = await db.all(' SELECT id FROM PSEUDO WHERE pseudo = ? ',[ins_pseudo_name]) 
    let password_id = await db.all(' SELECT id FROM PASSWORD WHERE password  = ?' ,[ins_acc_pass]) 
    
    if(Object.keys(email_id).length === 0 && email_id.constructor === Array){
      email = {
          id : -1
      }
      email_id = [email]
    }

    if(Object.keys(pseudo_id).length === 0 && pseudo_id.constructor === Array){
       pseudo = {
            id : -2
        }
        pseudo_id = [pseudo]
      }

      if( Object.keys(password_id).length === 0 && password_id.constructor === Array){
        password = {
            id : -3
        }
        
       password_id = [password]
      }
      if(email_id)
      {
          if ( (email_id[0].id== pseudo_id[0].id ) && (email_id[0].id == password_id[0].id))
          {
            req.session.login = true
            data ={
                login : true,
                d_mail  : ins_email,
                d_pseudo : ins_pseudo_name,
                d_pass : ins_acc_pass
            }
            db.run('INSERT INTO TEMP (user) VALUES(?)', [ins_pseudo_name])
            res.redirect(302,"/")
          }
          else{
                data = {
                    login : false
                }
                res.render("new_account")
          }
      }
      else {
        
        data = {
            login : false
        }
        res.render("new_account")
      }
})



app.post('/posts',async(req,res)=>{

    const db = await openDb()

    const post = req.body.my_post
    id = await db.all('SELECT MAX(id) as maxID FROM TEMP')
    const user_ps = await db.all('SELECT user FROM TEMP')

    var upVotes = [];
    var downVotes = [];
    var voteScore = 0;

    db.run('INSERT INTO  POST (post,post_owner,upVotes,downVotes,voteScore,post_date) VALUES(?,?,?,?,?,?)',[post,user_ps[id[0].maxID-1].user,upVotes ,downVotes,voteScore,full_date])
    
    res.redirect(302,'/')
})

app.post('/comment',async(req,res)=>{
    const db = await openDb()
    const comment = req.body.my_comment
    id = await db.all('SELECT MAX(id) as maxID FROM TEMP')
    const user_ps = await db.all('SELECT user FROM TEMP')
    db.run('INSERT INTO  COMMENT (comment,comment_owner) VALUES(?,?)',[comment,user_ps[id[0].maxID-1].user])
    res.redirect(302,'/')    
})

/*app.get('/comment',async(req,res)=>{
    const db = await openDb()
    const param = req.query.p1

    nb_of_post =  id = await db.all('SELECT MAX(id) as maxID_post FROM POST')
    post_id = param - nb_of_posts[0].maxID_post
    db.run('INSERT INTO POST(cmnt_number)  VALUES(?)',[3])
    post_id = Math.abs(post_id)


    a_comment = await db.all('SELECT comment FROM COMMENT ')
    id = await db.all('SELECT MAX(id) as maxID FROM COMMENT')
    id_current = await db.all('SELECT MAX(id) as maxID_user FROM TEMP')
    current_user = await db.all('SELECT user FROM TEMP WHERE id =?',[id_current[0].maxID_user])

    if(a_comment[0]){
        user_comm = await db.all('SELECT comment_owner FROM COMMENT')
    }else{
        user_comm = await db.all('SELECT user FROM TEMP')
    }
    
    for(var i=old_max_cmnt;i<id[0].maxID;i++)
    {
      
        if (i == null)
        {
            table_cmnt.unshift(0)
        } else{
            table_cmnt.unshift(i)
        }
       
    }
    
    old_max = id[0].maxID

    data_1 = {
        the_comment : a_comment,
        posts_number : id,
        list : table_cmnt,
        the_user : user_comm,
    }
    res.render("accueil",data_1)
})*/





  app.get('/my_profil',async(re,res)=>{
    const db = await openDb()
    ever = await db.all('SELECT * FROM TEMP')
    id_temp = await db.all('SELECT MAX(id) as maxID FROM TEMP')
    user_temp = await db.all('SELECT user FROM TEMP WHERE id = ?',[id_temp[0].maxID])
    post_for_profil = await db.all('SELECT post FROM POST WHERE post_owner = ?',[user_temp[0].user])
    nb_posts_user = await db.all('SELECT COUNT(id) as cnt FROM POST WHERE post_owner = ?',[user_temp[0].user])
    the_date = await db.all('SELECT post_date FROM POST')
    comment = await db.all('SELECT comment FROM COMMENT')
    
    for(var i=0;i<nb_posts_user[0].cnt;i++){
        profile_posts.unshift(i)
    }

    
    data = {
        nb_profil_post : profile_posts,
        profil_post : post_for_profil,
        current_date : the_date,
        my_comment : comment
    }
    
    profile_posts = []
    res.render("profil",data)
})

app.get('/logout',(req,res)=>{
    req.session.login = false
    res.redirect(302,"/")
})

app.listen(port,() => {
    console.log("Listening on port ", port)
})