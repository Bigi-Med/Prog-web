const {openDb} = require("./db")

const tablesNames = ["IDENTIFICATION"]

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

async function createTables(db){
    const cat = db.run(`
      CREATE TABLE IF NOT EXISTS IDENTIFICATION(
        email varchar(255),
        pseudo varchar(255),
        password varchar(255),
        pseudo_id INTEGER PRIMARY KEY AUTOINCREMENT
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
    await createTables(db)
    
})()
  
