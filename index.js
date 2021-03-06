import express from 'express';
import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Use JSON file for storage
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)
// await db.read()
db.data = db.data || { user: [] }

const app = express();

// app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/cache'));

var dict = {};
app.post('/upload', async (req, res) => {
    let name = req.body.name.trim()
    console.log('Got body:', req.body.name + " at " + req.body.time);

    dict[name] = {
        time: req.body.time,
        img: req.body.img
    };

    console.log(Object.keys(dict));

    var base64Data = req.body.img.replace(/^data:image\/png;base64,/, "");

    let dir = __dirname + '/cache'
    fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) throw err;
        fs.writeFile(dir + "/" + req.body.name.replace(/ /g, "").toLocaleLowerCase() + ".png", base64Data, 'base64', function (err) {
            console.log(err);
        });

    });




    // //start
    // let jayson = {
    //     name: name,
    //     time: req.body.time,
    //     img: req.body.img
    // };
    // const i = db.data.user.findIndex(u => u.name === name);
    // console.log("i is :" + i);
    // if (i === -1) {
    //     await db.data.user.push(jayson)
    // } else {
    //     db.data.user[i] = jayson;
    // }

    // await db.write();
    // //end

    res.sendStatus(200);
});

app.get('/cache', (req, res) => {
    let gg = ":"
    let dir = __dirname + '/cache'

    fs.readdir(dir, (err, files) => {
        if (files) {

            files.forEach(file => {
                gg += "<p>" + file + "</p>"
            });
        }
        res.send(gg);

    });


});

app.get('/body', (req, res) => {
    res.send(JSON.stringify(db.data.user));

    // res.send(JSON.stringify(dict));
});
app.get('/db/read', async (req, res) => {
    // let gg = await db.data.user
    // console.log(gg)
    // res.send((gg));

    const i = db.data.user.findIndex(u => u.name === "THANA SINGH");
    if (i === -1) res.send(db.data.user[i])
    else res.send("no hay nada")

    // await db.write();
});
app.get('/db/write', async (req, res) => {
    // await db.data.user.push({ name: "THANA SINGH", time: "sd", img: "<img src='data:12453'></img>" });
    await db.data.user.push({ name: "THANA GILL", time: "sds", img: "<img src='data:12453'></img>" });
    await db.write();
    res.send("ok");
});

app.get('/cache/:query', async (req, res) => {
    let name = req.params.query.trim()
    // if (dict[name])
    //     res.send(dict[name].img)
    // else
    //     res.send("NOT FOUND")


    const i = db.data.user.findIndex(u => u.name === name);
    if (i === -1) {
        res.send("NOT FOUND.")

    } else {
        res.send("<div>" + await db.data.user[i].img + "<p>Actualizado: " + await db.data.user[i].time + "</p></div>")
        await db.write();
    }
})
const port = process.env.PORT || 3001

app.listen(port, async () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
