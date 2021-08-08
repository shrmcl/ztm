const express = require('express')
const app = express()
// password encryption
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
// SQL querying module
const knex = require('knex')
const db = knex({
  client: 'pg', // 'pg' is the installed postgres module
  connection: {
    host: '127.0.0.1', // same as localhost
    database: 'smartbrain',
  },
})
// json parser for 'x-www-form-urlencoded' (postman)
app.use(express.urlencoded({extended: true}))
// json parser for 'raw' JSON (postman)
app.use(express.json())
app.use(cors())
// port
const port = process.env.PORT || 3000

// ROOT route
app.get('/', (req, res) => {
  res.send('hi')
})

// SIGNIN
app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
      if (isValid) {
        return db.select('*').from('users')
        .where('email', '=', req.body.email)
        .then(user => {
          res.json(user[0])
        })
        .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

// REGISTER 
app.post('/register', (req, res) => {
  const {email, name, password} = req.body
  // encrtypt the pw
  const hash = bcrypt.hashSync(password);
    // set up transaction to only update 'users' if 'login' update succeeds 
    db.transaction(trx => {
      // first update login table
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      // only return email to update users 
      .returning('email')
      // then update users table
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
})

// GET USER with id param
app.get('/profile/:id', (req, res) => {
  const {id} = req.params
  // find the id in the db
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        // respond with user info
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})

// IMAGE
app.put('/image', (req, res) => {
  const {id} = req.body;
  // increment users' entries on db
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0])
  })
  .catch(err => res.status(400).json('unable to get entries'))
})

// listener
app.listen(port, () => console.log(`listening on port ${port}`))
