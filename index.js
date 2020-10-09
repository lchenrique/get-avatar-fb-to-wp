const express = require('express');
const bodyParser = require('body-parser');
const avatar = require('./getAvatar')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/avatar', async (req, res) => {
    const isFinish =  await avatar(req.body.user, req.body.pass)
    if(isFinish){
        console.log('foi')
        res.status(200).send(isFinish)
    }
})


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running, port ${PORT}`));