const router = require('express').Router();
const bcrypt = require('bcryptjs');
const signToken = require('./signToken.js');

const db = require('../database/dbConfig');

router.get('/users', (req, res) => {
  db('users').select('id', 'username')
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    })
})

router.post('/register', (req, res) => {
  const user = req.body;
  
  const hash = bcrypt.hashSync(user.password, 5);

  user.password = hash;

  db('users').insert(user).returning('id')
    .then(([id]) => {
      db('users').select('id', 'username').where({ id })
        .then(user => {
          res.status(201).json(user);
        });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db('users').where({ username })
    .then(([user]) => {
      if(user && bcrypt.compareSync(password, user.password)) {
        const token = signToken(user);

        res.status(200).json({ userToken: token });
      }
      else {
        res.status(401).json({ error: "incorrect login" });
      }
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});


module.exports = router;
