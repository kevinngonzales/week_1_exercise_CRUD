console.log('Is this thing on?');

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const PORT = 3000;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

require('dotenv').config({ path: '.env' });


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));


//should always be above CRUD code


app.post('/users', (req, res) => {
    const { username, password } = req.body;
    prisma.user.create({
        data: {
            username,
            password,
            posts: {
                create: {
                    title: 'My first post',
                    body: 'Lots of really interesting stuff',
                },
            },
        }
    })
        .then(result => {
            res.redirect('/');
        })
        .catch(error => {

            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        })
})




// app.post('/posts', (req, res) => {
//     const { title, body, } = req.body;

//     prisma.post.create({
//         data: {
//             title,
//             body,
//             user: {

//             }
//         }
//     })


//         .then(result => {
//             res.redirect('/');
//         })
//         .catch(error => {
//             // Handle errors
//             console.error(error);
//             res.status(500).json({ error: "Internal Server Error" });
//         })
// })




app.get('/', async (req, res) => {
    const body = { users: null, posts: null }

    const users = await prisma.user
        .findMany()
        .then(results => {
            body.users = results;
        })
        .catch(error => console.error(error))

    const posts = await prisma.post
        .findMany()
        .then(results => {
            body.posts = results;
        })
        .catch(error => console.error(error));

    res.render('index.ejs', { body: body })
})










MongoClient.connect(process.env.MONGO_URI)
    .then(client => {
        const db = client.db('practice');
        const usersCollection = db.collection('users');

        // app.get('/', (req, res) => {
        //     usersCollection
        //         .find()
        //         .toArray()
        //         .then(results => {
        //             res.render('index.ejs', { usersCollection: results })
        //         })
        //         .catch(error => console.error(error))
        // })

        app.put('/users', (req, res) => {
            usersCollection
                .findOneAndUpdate(
                    { username: req.body.username },
                    {
                        $set: {
                            username: req.body.username,
                            password: req.body.password,
                        },
                    },
                    {
                        upsert: false,
                    },
                    {
                        returnNewDocument: true
                    }
                )
                .then(result => {
                    res.json('Success')
                    return res
                })
                .catch(error => console.error(error))
        })

        app.delete('/users', (req, res) => {
            usersCollection
                .deleteOne(
                    { username: req.body.username }
                )
                .then(result => {
                    console.log(`Deleted ${req.body.username}`)
                    console.log(result);
                    res.json('Deleted user')
                })
                .catch(error => console.error(error))
        })
    })
// app.post('/users', (req, res) => {
//     usersCollection
//         .insertOne(req.body)
//         .then(results => {
//             res.redirect('/');
//         })
// })
// // })
// .catch(error => console.log(error));


// always keep at bottom
app.listen(PORT, function () {
    console.log(`Server is live! Listening at port ${PORT}`);
})

