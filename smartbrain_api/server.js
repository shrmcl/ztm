const express = require('express')
const app = express()
// json parser for 'x-www-form-urlencoded' (postman)
app.use(express.urlencoded({ extended: true }));
// json parser for 'raw' JSON (postman)
app.use(express.json())
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
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@sally.io',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ]
}
// root route
app.get('/', (req, res) => {
  res.send('root works')
})

// signin
app.post('/signin', (req, res) => {
    console.log(req.body)
    if (req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password) {
        res.send('signin success')
      }
})

app.post ('/register', (req, res) => {
  const { email, name, password } = req.body;
  // push new user to temp databse
  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  })
  console.log(req.body)
  // send latest user as a json response
  res.json(database.users[database.users.length - 1])
})

// find a logged-in user with their id
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
   // set variable to see if user can be found. default false.
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      // when user is found, set found to true
      found = true;
      return res.json(user);
    }
  })
  // status to send if user not found
  if(!found) {
    res.status(400).json('not found')
  }
})

app.post('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries)
    }
  })
  if(!found) {
    res.status(400).json('not found')
  }
})

// listener
app.listen(port, () => console.log(`listening on port ${port}`))