const express = require('express');
const cors = require('cors');
const knex = require('knex');
const app = express();

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'admin',
      password : '159357',
      database : 'face-recognition-db'
    }
});

app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: '1',
            name: 'John',
            email: 'john@email.com',
            password: '12345',
            entries: 0,
            joined: new Date()
        },
        {
            id: '2',
            name: 'Jane',
            email: 'jane@email.com',
            password: '54321',
            entries: 0,
            joined: new Date()
        }
    ]
}


app.get('/', (req, res) => {
    res.json(database.users);
});

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email
    && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('sign in fail');
    }
});

app.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
        })
        .then(user => res.json(user[0]))
        .catch(err => res.status(400).json('Unable to Sign Up'));
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select()
        .from('users')
        .where({id: id})
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('No Such User');
            }
        });
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    let userFound = false;
    database.users.forEach(user => {
        if(user.id === id) {
            userFound = true;
            user.entries++;
            return res.json(user.entries);
        }
    });
    if (!userFound) {
        res.status(404).json('no such user');
    }
})

app.listen(3030, () => console.log('app is running on port 3030'));