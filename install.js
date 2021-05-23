const {openDb} = require("./db")

const tablesNames = ['EMAIL','PSEUDO','PASSWORD','POST','COMMENT','TEMP']




async () => {
    let db = await openDb()
    await db.run ('DROP TABLE EMAIL');
    await db.run (`CREATE TABLE EMAIL (
        email varchar(255),
        
        id INTEGER PRIMARY KEY AUTOINCREMENT
        );
    `)

}

async () => {
  let db = await openDb()
  await db.run ('DROP TABLE PSEUDO');
  await db.run (`CREATE TABLE PSEUDO (
      pseudo varchar(255),
      
      id INTEGER PRIMARY KEY AUTOINCREMENT
      );
  `)

}

async () => {
  let db = await openDb()
  await db.run ('DROP TABLE PASSWORD');
  await db.run (`CREATE TABLE PASSWORD (
      password varchar(255),
      
      id INTEGER PRIMARY KEY AUTOINCREMENT
      );
  `)

}

async () => {
  let db = await openDb()
  await db.run ('DROP TABLE POST');
  await db.run (`CREATE TABLE POST (
      post varchar(255),
      post_owner varchar(255),
      upVotes INTEGER,
      downVotes INTEGER,
      voteScore INTEGER,
      post_date varchar(255),
      
      id INTEGER PRIMARY KEY AUTOINCREMENT
      );
  `)

}

async () => {
  let db = await openDb()
  await db.run ('DROP TABLE COMMENT');
  await db.run (`CREATE TABLE COMMENT (
      comment varchar(255),
      comment_owner varchar(255),
      upVotes INTEGER,
      downVotes INTEGER,
      voteScore INTEGER,
      comment_post varchar (255),
      id INTEGER PRIMARY KEY AUTOINCREMENT
      );
  `)

}

async () => {
  let db = await openDb()
  await db.run ('DROP TABLE TEMP');
  await db.run (`CREATE TABLE TEMP (
      user varchar(255),
      
      id INTEGER PRIMARY KEY AUTOINCREMENT
      );
  `)

}

async function insert_email(db){
  const insertRequest = await db.prepare("INSERT INTO EMAIL(email) VALUES(?)")
  const contents = [{
    email: "max@gmail.com",
   
  },
    {
      email: "bob@gmail.com",
      
    }
  ]
  return await Promise.all(contents.map(em => {
    return insertRequest.run([em.email])
  }))
}

async function insert_pseudo(db){
  const insertRequest = await db.prepare("INSERT INTO PSEUDO(pseudo) VALUES(?)")
  const contents = [{
    pseudo: "max",
   
  },
    {
      pseudo: "bob",
      
    }
  ]
  return await Promise.all(contents.map(ps => {
    return insertRequest.run([ps.pseudo])
  }))
}

async function insert_password(db){
  const insertRequest = await db.prepare("INSERT INTO PASSWORD(password) VALUES(?)")
  const contents = [{
    password: "max",
   
  },
    {
      password: "bob",
      
    }
  ]
  return await Promise.all(contents.map(pass => {
    return insertRequest.run([pass.password])
  }))
}

async function insert_post(db){
  const insertRequest = await db.prepare("INSERT INTO POST(post,post_owner,post_date) VALUES(?,?,?)")
  const contents = [{
    post: "www.google.fr",
    post_owner : "max",
    post_date : "23/05/2021 19:11:10",
    
   
  },
    
  ]
  return await Promise.all(contents.map(post => {
    return insertRequest.run([post.post,post.post_owner,post.post_date])
  }))
}

async function insert_comment(db){
  const insertRequest = await db.prepare("INSERT INTO comment(comment,comment_owner) VALUES(?,?)")
  const contents = [{
    comment: "Excellent site pour faire des recherches",
    comment_owner : "bob",
    
   
  },
    
  ]
  return await Promise.all(contents.map(cmnt => {
    return insertRequest.run([cmnt.comment,cmnt.comment_owner])
  }))
}




  async function createTables_email(db){
    const em = db.run(`
      CREATE TABLE IF NOT EXISTS EMAIL(
        email varchar(255),
        id INTEGER PRIMARY KEY AUTOINCREMENT
        );
    `)
    return await Promise.all([em])
  }


async function createTables_pseudo(db){
    const ps = db.run(`
      CREATE TABLE IF NOT EXISTS PSEUDO(
        
        pseudo varchar(255),
        
        id INTEGER PRIMARY KEY AUTOINCREMENT
        );
    `)
    return await Promise.all([ps])
  }

  async function createTables_password(db){
    const pass = db.run(`
      CREATE TABLE IF NOT EXISTS PASSWORD(
        
        password varchar(255),
        
        id INTEGER PRIMARY KEY AUTOINCREMENT
        );
    `)
    return await Promise.all([pass])
  }

  async function createTables_post(db){
    const post = db.run(`
      CREATE TABLE IF NOT EXISTS POST(
        post varchar(255),
        post_owner varchar(255),
        upVotes INTEGER,
        downVotes INTEGER,
        voteScore INTEGER,
        post_date varchar(255),
        
        id INTEGER PRIMARY KEY AUTOINCREMENT
        );
    `)
    return await Promise.all([post])
  }

  async function createTables_comment(db){
    const cmnt = db.run(`
      CREATE TABLE IF NOT EXISTS COMMENT(
      comment varchar(255),
      comment_owner varchar(255),
      comment_post varchar (255),
      id INTEGER PRIMARY KEY AUTOINCREMENT
      );
    `)
    return await Promise.all([cmnt])
  }

  async function createTables_temp(db){
    const tmp = db.run(`
      CREATE TABLE IF NOT EXISTS TEMP(
      user varchar(255),
      id INTEGER PRIMARY KEY AUTOINCREMENT
      );
    `)
    return await Promise.all([tmp])
  }


async function dropTables(db){
    return await Promise.all(tablesNames.map( tableName => {
        return db.run(`DROP TABLE IF EXISTS ${tableName}`)
      }
    ))
  }

(async () => {
    // open the database
    let db = await openDb()
    await dropTables(db)
    await createTables_email(db)
    await createTables_pseudo(db)
    await createTables_password(db)
    await createTables_post(db)
    await createTables_comment(db)
    await createTables_temp(db)
    await insert_email(db)
    await insert_pseudo(db)
    await insert_password(db)
    await insert_post(db)
    await insert_comment(db)
})()
  
