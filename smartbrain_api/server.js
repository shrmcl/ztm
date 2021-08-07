const express = require('express')
const app = express()
// password encryption
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
// SQL querying package:
const knex = require('knex')

const db = knex({
  // 'pg' is the installed postgres package
  client: 'pg',
  connection: {
    host: '127.0.0.1', // same as localhost
    database: 'smartbrain',
  },
})

// knex query builder
db.select('*')
  .from('users')
  .then((data) => {
    // console.log(data);
  })

// json parser for 'x-www-form-urlencoded' (postman)
app.use(express.urlencoded({extended: true}))
// json parser for 'raw' JSON (postman)
app.use(express.json())
app.use(cors())
// port
const port = process.env.PORT || 3000

// root route
app.get('/', (req, res) => {
  res.send(database.users)
})

// signin
app.post('/signin', (req, res) => {
  // // handle password encryption
  // // Load hash from your password DB.
  // const hash = '$2a$10$dle.toG5lJJaKazaluM0N.bajfvG7aZqrrtVZotMvn596h/QU1dqy'
  // bcrypt.compare('apples', hash, function (err, res) {
  //   // res == true
  //   console.log('first guess ', res)
  // })
  // bcrypt.compare('veggies', hash, function (err, res) {
  //   // res = false
  //   console.log('second guess ', res)
  // })
  // console.log(req.body)
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0])
  } else {
    res.status(400).json('error loggin in')
  }
})

app.post('/register', (req, res) => {
  const {email, name, password} = req.body
  // send all registered user details to db
  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0])
    })
    .catch((err) => res.status(400).json('unable to register'))
})

// find a logged-in user with their id
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

app.put('/image', (req, res) => {
  const {id} = req.body
  let found = false
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true
      user.entries++
      return res.json(user.entries)
    }
  })
  if (!found) {
    res.status(400).json('not found')
  }
})

// listener
app.listen(port, () => console.log(`listening on port ${port}`))
