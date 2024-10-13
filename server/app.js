"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors_1 = __importDefault(require("cors"));
const app = express();
const port = 3000;
const mysql = require("mysql2");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'todo',
    password: 'Spengergasse 20',
    database: 'todo'
});
connection.connect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    console.error(err);
    res.status(500).send('Something broke!  ' + err);
}
app.use(errorHandler);
class Todo {
    constructor(id, text) {
        this.id = id;
        this.text = text;
    }
}
app.get('/todo/', (req, res, next) => {
    let data = [];
    connection.query('SELECT * FROM todo', (err, rows) => {
        if (err)
            next(err);
        for (let i = 0; i < rows.length; i++)
            data.push(new Todo(rows[i].id, rows[i].text));
        res.status(200).send(data);
    });
});
app.get('/todo/:id', (req, res, next) => {
    connection.query('SELECT * FROM todo WHERE id = ' + connection.escape(req.params.id), (err, rows) => {
        if (err)
            next(err);
        if (rows.length > 0)
            res.status(200).send(new Todo(rows[0].id, rows[0].text));
        else
            res.status(404).end();
    });
});
app.delete('/todo/:id', (req, res, next) => {
    let sql = "DELETE FROM todo WHERE id = " + connection.escape(req.params.id);
    connection.query(sql, (err, result) => {
        if (err)
            next(err);
        res.status(200).end();
    });
});
app.post('/todo/', (req, res, next) => {
    let sql = "INSERT INTO todo SET ?";
    console.log(req.body.text);
    connection.query(sql, { text: req.body.text }, (err, result) => {
        if (err)
            next(err);
        console.log(result);
        res.status(200).send(new Todo(result.insertId, req.body.text));
    });
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
