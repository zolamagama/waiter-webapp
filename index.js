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

app.get('/waiter/', async function (req, res) {
    const weekdays = await waiter.getDays()

  

    res.render('waiter', {
        weekdays

    })

});

app.get('/waiter/:username', async function (req, res) {

    const user = _.capitalize(req.params.username)
    const days = req.body.weekdays
    await waiter.addWaiter(user)
    const weekdays = await waiter.getDays()
    const waiter_id = await waiter.waiterID(user)
    const getCheckedDays = await waiter.checkedShifts(waiter_id)

    weekdays.forEach(day => {
        getCheckedDays.forEach(waiter => {
            if (waiter.weekdays_id === day.id) {
                day.state = "checked"
            }
        })
    });

    res.render('waiter', {
        username: user,
        select: days,
        weekdays,
        getCheckedDays

    });


});

app.post('/waiter/:username', async function (req, res) {
    const user = _.capitalize(req.params.username)
    const days = req.body.weekdays
    var select = await waiter.selectDays(user, days)
    const weekdays = await waiter.getDays()
    const waiter_id = await waiter.waiterID(user)
    const getCheckedDays = await waiter.checkedShifts(waiter_id)

    try {
        if (days !== '') {
            req.flash('success', `${user}, you have successfully submitted shift days`)

        } else {
            req.flash('error', 'Please select your shift days')
        }

        res.render('waiter', {
            select,
            weekdays,
            getCheckedDays
        })

    } catch (error) {

    }

});

app.get('/clear', async function (req, res) {

    req.flash('success', 'You have successfully cleared the data')
    await waiter.reset()


    res.render('administrator', {

    })

});

app.get('/days', async function (req, res) {

    const insert = await waiter.getEachWaiter()

    res.render('administrator', {
        insert

    })

});




















const PORT = process.env.PORT || 7676

app.listen(PORT, function () {

    console.log("App started at port:", PORT)

});