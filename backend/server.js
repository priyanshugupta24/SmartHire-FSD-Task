const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const extra = require("./routes/extra.routes")

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const mongooseUrl = process.env.MONGOOSEURL;

mongoose.pluralize(null);
mongoose.connect(mongooseUrl).then(() => console.log("Connected to Database Successfully!!")).catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(cookieParser());

app.use("/api",extra)

app.get("/", (req, res) => {
    res.send("Working");
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));