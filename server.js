const express = require('express');
const cors = require('cors');
const app = express();

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
        res.json('sign in success');
    } else {
        res.status(400).json('sign in fail');
    }
});

app.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    database.users.push(
        {
            id: '3',
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()
        }
    );
    res.json(database.users[database.users.length-1]);
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let userFound = false;
    database.users.forEach(user => {
        if(user.id === id) {
            userFound = true;
            return res.json(user);
        }
    });
    if (!userFound) {
        res.status(404).json('no such user');
    }
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