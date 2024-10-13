import express = require('express');
import cors from 'cors';
const app = express();
const port: number = 3000;

import mysql = require('mysql2');
import {ResultSetHeader, RowDataPacket} from "mysql2";
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'todo',
    password: 'Spengergasse 20',
    database: 'todo'
})
connection.connect();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());

function errorHandler(err:any, req:any, res:any, next:any)  {
    if (res.headersSent) {
        return next(err);
    }
    console.error(err);
    res.status(500).send('Something broke!  ' + err);
}
app.use(errorHandler);


class Todo {
    readonly id:number;
    readonly text:string;
    constructor(id:number, text:string){
        this.id = id; this.text=text;
    }
}

app.get('/todo/',
    (req,
     res, next) => {
        let  data: Todo[] = [];
        connection.query<RowDataPacket[]>('SELECT * FROM todo', (err, rows) => {
            if (err) next(err);
            for (let i:number = 0; i < rows.length; i++)
                data.push(new Todo(rows[i].id,rows[i].text));
            res.status(200).send(data);
        })
    })
app.get('/todo/:id', (req, res, next) => {
    connection.query<RowDataPacket[]>('SELECT * FROM todo WHERE id = ' + connection.escape(req.params.id) , (err, rows) => {
        if (err) next(err);
        if (rows.length > 0)
            res.status(200).send(new Todo(rows[0].id, rows[0].text));
        else res.status(404).end();
    })
})
app.delete('/todo/:id',  (req, res, next) =>{
    let sql:string= "DELETE FROM todo WHERE id = " + connection.escape(req.params.id);
    connection.query<ResultSetHeader>(sql, (err, result) => {
        if(err) next(err);
        res.status(200).end();
    })
})
app.post('/todo/',  (req, res, next) =>{
    let sql = "INSERT INTO todo SET ?";
    console.log(req.body.text);
    connection.query<ResultSetHeader>(sql,{text: req.body.text}, (err, result) => {
        if(err) next(err);
        console.log(result);
        res.status(200).send(new Todo(result.insertId,req.body.text));
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
