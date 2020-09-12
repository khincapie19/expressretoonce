var express = require('express');
const mongoose = require("mongoose");
const Record = require("./models/record");
var app = express();

mongoose.connect("mongodb://localhost:27017/records", { useNewUrlParser: true });

app.set("view engine", "pug");// configuraciòn para unir con pug
app.set("views", "views"); //  decimos donde queremos guardar esos archivos
app.use(express.urlencoded({extended: true}));
app.use("/static", express.static("public"));


app.get('/register', (req, res) => {
  res.render("new")
});

app.post('/register', async (req, res, next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  try {
    const record = new Record(data);
    await record.save();
  } catch(e) {
    return next(e);
  }
  res.redirect("/");
});

app.get('/', async(req, res) => {
  const records = await Record.find();
  res.render("index", { records })
});

app.listen(3000, () => console.log('Listening on port 3000!'));
