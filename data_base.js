const {openDb} = require("./db")

//const tablesNames = ["IDENTIFICATION"]


const tablesNames = ['EMAIL','PSEUDO','PASSWORD','POST']
//const tablename = "identification"

/*async () => {
    let db = await openDb()
    await db.run ('DROP TABLE IDENTIFICATION');
    await db.run (`CREATE TABLE IDENTIFICATION (
        email varchar(255),
        pseudo varchar(255),
        password varchar(255),
        pseudo_id INTEGER PRIMARY KEY AUTOINCREMENT
        );
    `)

}*/



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
      id INTEGER PRIMARY KEY AUTOINCREMENT
      );
  `)

}


/*async function createTables(db){
    const cat = db.run(`
      CREATE TABLE IF NOT EXISTS IDENTIFICATION(
        email varchar(255),
        pseudo varchar(255),
        password varchar(255),
        pseudo_id INTEGER PRIMARY KEY AUTOINCREMENT
        );
    `)
    return await Promise.all([cat])
  }*/


  async function createTables_email(db){
    const cat = db.run(`
      CREATE TABLE IF NOT EXISTS EMAIL(
        email varchar(255),
        id INTEGER PRIMARY KEY AUTOINCREMENT
        );
    `)
    return await Promise.all([cat])
  }


async function createTables_pseudo(db){
    const cat = db.run(`
      CREATE TABLE IF NOT EXISTS PSEUDO(
        
        pseudo varchar(255),
        
        id INTEGER PRIMARY KEY AUTOINCREMENT
        );
    `)
    return await Promise.all([cat])
  }

  async function createTables_password(db){
    const cat = db.run(`
      CREATE TABLE IF NOT EXISTS PASSWORD(
        
        password varchar(255),
        
        id INTEGER PRIMARY KEY AUTOINCREMENT
        );
    `)
    return await Promise.all([cat])
  }

  async function createTables_post(db){
    const cat = db.run(`
      CREATE TABLE IF NOT EXISTS POST(
        post varchar(255),
        post_owner varchar(255),
        id INTEGER PRIMARY KEY AUTOINCREMENT
        );
    `)
    return await Promise.all([cat])
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
})()
  
