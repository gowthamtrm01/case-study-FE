const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Info = require('./model/info');

const app = express();
const PORT = process.env.PORT || 5000;
const URL = process.env.MONGO_URL || "mongodb://localhost/movieData"

app.use(express.json());
app.use(cors());

app.get('/all', async (req, res) => {
    const all = await Info.find();
    res.send(all);
})

app.post('/add', async (req, res) => {
    const info = req.body;
    const newInfo = new Info({...info});
    try{
        const sentInfo = await newInfo.save();
        res.status(200).send(sentInfo);
    }catch(e){
        res.status(400).send({message: error.message});
    }
})

app.patch('/update/:id', async (req, res) => {
    const {id: _id} = req.params;
    const update = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No info with that id');
    const updateInfo = await Info.findByIdAndUpdate(_id, {...update, _id}, {new: true});
    res.status(200).send(updateInfo);
})

app.delete('/delete/:id', async (req, res) => {
    const {id: _id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No info with that id');
    await Info.findByIdAndRemove(_id);
    res.status(200).send({message: 'info delete successfully'});
})

mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true}, {useFindAndModify: true})
    .then(() => app.listen(PORT, () => console.log(`server was running at ${PORT}`)))
    .catch((error) => console.log(error.message));
