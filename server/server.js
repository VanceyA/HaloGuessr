const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false
}));

mongoose.connect(process.env.MONGO_URI);

const port = process.env.PORT || 8080;


app.use("/api/games", require("./routes/gameRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
// app.use("/api/user", require("./routes/userRoutes"));




app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});