const express = require('express')
const app = express()
// password encryption
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
// json parser for 'x-www-form-urlencoded' (postman)
app.use(express.urlencoded({extended: true}))
// json parser for 'raw' JSON (postman)
app.use(express.json())
app.use(cors())
// port
const port = process.env.PORT || 3000

// fake database data
const database = {
  users: [
    {
      id: '123',
      name: 'Jonn',
      email: 'john@john.io',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@sally.io',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    },
  ],
}

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
  // pw encryption w/ 'bcrypt-nodejs' package
  bcrypt.hash(password, null, null, function (err, hash) {
    console.log(hash)
  })
  // push new user to temp databse
  database.users.push({
    id: '125',
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  })
  console.log(req.body)
  // send latest user as a json response
  res.json(database.users[database.users.length - 1])
})

// find a logged-in user with their id
app.get('/profile/:id', (req, res) => {
  const {id} = req.params
  // set variable to see if user can be found. default false.
  let found = false
  database.users.forEach((user) => {
    if (user.id === id) {
      // when user is found, set found to true
      found = true
      return res.json(user)
    }
  })
  // status to send if user not found
  if (!found) {
    res.status(400).json('not found')
  }
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
