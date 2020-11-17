const express = require('express');

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');

const flash = require('express-flash');

const session = require('express-session');

const pg = require("pg");

const Pool = pg.Pool;

const _ = require('lodash');

const waiter_availability = require('./waiter')


const app = express();

app.engine('handlebars', exphbs({
    layoutsDir: './views/layouts'
}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/waiter-availability';

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(session({
    secret: "Align messages",
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

const pool = new Pool({
    connectionString,
});

const waiter = waiter_availability(pool)

app.get('/', async function (req, res) {

    res.render('index')

});

app.get('/waiter', async function (req, res) {


    res.render('waiter')

});

app.get('/waiter/:username', async function (req, res) {

    const user = _.capitalize(req.params.username)
    const days = req.body.weekdays

    res.render('waiter', {
        username: user,
        select: days
    });


});

app.post('/waiter/:username', async function (req, res) {
    const user = _.capitalize(req.params.username)
    const days = req.body.weekdays

    try {    
    req.flash('success', `${user} have successfully submitted your working days`)
    var select = await waiter.selectDays(user, days)

    var using = await waiter.addWaiter(user)


    res.render('waiter', {
        using, select
    })

    }
    catch (error) {

    }



});

app.get('/clear', async function (req, res, next) {
    try {
        req.flash('success', 'You have successfully cleared the data')
        await waiter.reset()


        res.render('administrator', {

        })
    } catch (error) {
        next(error)
    }
});

app.get('/days', async function (req, res) {

    const weekdays = await waiter.getDays()
    const waiters = await waiter.getWaiter()
    const insert = await waiter.getEachWaiter()
    var workingDays = await waiter.displayData()


    res.render('administrator', {

        insert,
        workingDays,
        weekdays,
        waiters

    })

});




















const PORT = process.env.PORT || 4545;

app.listen(PORT, function () {

    console.log("App started at port:", PORT)

});