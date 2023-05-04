if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const cors = require('cors')
const mongoose = require('mongoose');
const methodOverride = require('method-override');

app.use(express.json());
app.use(cors());

const dbConnect = process.env.MONGO_DB_URL;
mongoose.connect(dbConnect);


// routes

const customerRoute = require('./Routes/customerRoute');       

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: dbConnect,
    collection: 'sessionStore'
});
store.on('error', function (error) {
    console.log(error);
});
app.use(session({
    secret: 'This is a secret',
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 hour
    },
    store: store,
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride('_method'));
app.use(function (req, res, next) {
    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//user files

app.use('/users',customerRoute)


app.listen(process.env.PORT, () => console.log('server listening on port'));