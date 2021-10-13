import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const books = [
    {
        id: 1,
        name: 'Chi pheo',
        author: 'John'
    },
    
    {
        id: 2,
        name: 'Chien tranh va Hoa binh',
        author: 'John'
    }
]

app.get('/books', authenToken, (req, res) => {
    res.json({ status: 'Sucesss', data: books});
})

function authenToken(req, res, next) {
    const authorizationHeaders = req.headers['authorization'];
    console.log(authorizationHeaders);
    const token = authorizationHeaders.split(' ')[1];
    if (!token) {
        res.sendStatus(401);
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        console.log(err, data);
        if (err) throw err;
        next();
    })
}

app.get('/login', (req, res) => {
    res.send("aanaha");
    console.log({ data });
    const data = req.body;
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
    // res.cookie('jwttoken', accessToken);
    // res.headers['authorization'] = ` Beaer ${accessToken}`;
})
/**
 * const data = req.body;
    console.log({ data });
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30s',
    });
    res.json({ accessToken});
 */

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});


