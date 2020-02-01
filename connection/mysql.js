const mysql=require('mysql')

const db=mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'garuda17',
    database : 'pkcopywriting',
    port : '3306'
})

module.exports=db