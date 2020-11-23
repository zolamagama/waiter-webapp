const express = require('express');

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');

const flash = require('express-flash');

const session = require('express-session');

const pg = require("pg");

const Pool = pg.Pool;

const availability = require('./waiter_routes')

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
const employee = availability(waiter)

app.get('/', employee.index);

app.get('/waiter/', employee.enter);

app.get('/waiter/:username', employee.getShifts)

app.post('/waiter/:username', employee.selectShifts)

app.get('/clear', employee.reset)

app.get('/days', employee.getSchedule)


const PORT = process.env.PORT || 7676

app.listen(PORT, function () {

    console.log("App started at port:", PORT)

});