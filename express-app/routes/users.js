const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('mydb.db');
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name text)`);

router.get('/', function(req, res, next) {
  db.all("SELECT id, name FROM users", [], (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ items: rows });
    }
  });
});

router.get('/:id', function(req, res, next) {
  db.get("SELECT id, name FROM users WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      console.log(err);
    } else if (!row) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(row);
    }
  });
});

router.post('/', function(req, res, next) {
  const { name } = req.body;
  const insert = "INSERT INTO users (name) VALUES (?)";
  db.run(insert, [name], function(err) {
    if (err) {
      console.log(err);
    } else {
      res.status(201).json({ id: this.lastID, name });
    }
  });
});

module.exports = router;
