var express = require('express');
var app = express();
const mongoose = require("mongoose");
const Record = require("./models/record");
const User = require("./models/User");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true, useUnifiedTopology: true });

app.set("view engine", "pug");// configuraciòn para unir con pug
app.set("views", "views"); //  decimos donde queremos guardar esos archivos
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({
  secret: "login",
  maxAge: 24 * 60 * 60* 1000 // 24 hours
}));
app.use(cookieParser());

//app.use("/static", express.static("public"));

// const requireUser = (req, res, next) => {
//   if (!res.locals.user) {
//     return res.redirect("/login");
//   }
//   next();
// };

app.use(async (req, res, next) => {
  const userId = req.session.userId;
  if (userId)  {
    const user = await User.findById(userId);
    if (user) {
        res.locals.user = user;
    } else {
      delete req.session.userId;
    }
  }
  next();
});

app.get('/register', (req, res) => {
  res.render("new")
});

app.post('/register', async (req, res, next) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    res.redirect("/");
  } catch(e) {
    return next(e);
  }
});

app.get('/', async(req, res) => {
  const users = await User.find();
  const loggedIn = req.cookies["express:sess"];

  res.render("login", { users, loggedIn })
});

app.get("/login", (req, res) =>{
  const loggedIn = req.cookies["express:sess"];
  res.render("login", { loggedIn });
});

app.post("/login", async (req, res) =>{
  try {
    const user = await User.authenticate(req.body.email, req.body.password);
    if (user) {
      req.session.userId = user.Id;
      return res.redirect("/");
    } else {
      res.render("/login", { error: "Wrong email or password. Try again!"});
    }
  } catch (err) {
    return next(err);
  }
});

app.get("/logout", (req, res) =>{
  res.session = null;
  res.clearCookie("express:sess");
  res.clearCookie("express:sess.sig");
  res.redirect("login");
});


app.listen(3000, () => console.log('Listening on port 3000!'));

//Crear el modelo user (bcrypt)
//GET /login
//POST /login
  //verificar si lo ingreso bien su usuario y contraseña, sisi guardamos en la sesiòn el id del usuario si no, volvemos a mostrar el formulario del login
//GET /logout
//Crear un middleware de autenticación
//
