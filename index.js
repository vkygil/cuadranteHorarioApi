const express = require('express')

const app = express();

// app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
let dict = {};

app.post('/upload', (req, res) => {
    console.log('Got body:', req.body.name);
    let name = req.body.name.trim()

    dict[name] = {
        time: Date.now(),
        img: req.body.img
    };
    res.sendStatus(200);
});

app.get('/body', (req, res) => {
    res.send(JSON.stringify(dict));
});
app.get('/cache/:query', async (req, res) => {
    let name = req.params.query.trim()
    if (dict[name])
        res.send(dict[name].img)
    else
        res.send("NOT FOUND")

})
const port = process.env.PORT || 3001

app.listen(port, async () => {
    console.log(`Example app listening at http://localhost:${port}`)
})