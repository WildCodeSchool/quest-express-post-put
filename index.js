// dotenv loads parameters (port and database config) from .env
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// respond to requests on `/api/users`
app.get('/api/users', (req, res) => {
  // send an SQL query to get all users
  connection.query('SELECT * FROM user', (err, results) => {
    if (err) {
      // If an error has occurred, then the client is informed of the error
      res.status(500).json({
        error: err.message,
        sql: err.sql,
      });
    } else {
      // If everything went well, we send the result of the SQL query as JSON
      res.json(results);
    }
  });
});

app.get('/api/suppliers', (req, res) => {
  // send an SQL query to get all users
  connection.query('SELECT * FROM suppliers', (err, results) => {
    if (err) {
      // If an error has occurred, then the client is informed of the error
      res.status(500).json({
        error: err.message,
        sql: err.sql,
      });
    } else {
      // If everything went well, we send the result of the SQL query as JSON
      res.json(results);
    }
  });
});

/* *************** POST ***************** */
app.use(express.json());

app.post('/api/users', (req, res) => {
  // send an SQL query to get all users
  const { email, password, name } = req.body;
  const emailRegex = /[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,3}/;
  if (!email || !name || !password) {
    return res.status(422).json({
      error: 'at least one of the required fields is missing',
    });
  }
  if (password.length < 8) {
    return res.status(422).json({
      error: 'Password too short (8 characters min.)',
    });
  }
  if (!emailRegex.test(email)) {
    return res.status(422).json({
      error: 'Invalid email',
    });
  }
  // send an SQL query to get all users
  return connection.query(
    'INSERT INTO user SET ?',
    req.body,
    (err, results) => {
      if (err) {
        // If an error has occurred, then the client is informed of the error
        return res.status(500).json({
          error: err.message,
          sql: err.sql,
        });
      }
      // If everything went well, we send the result of the SQL query as JSON
      return res.json(results);
    }
  );
});

app.listen(process.env.PORT, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }

  console.log(`Server is listening on ${process.env.PORT}`);
});
