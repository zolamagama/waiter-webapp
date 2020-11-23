const assert = require('assert');

const waiter_availability = require('../waiter');

const pg = require("pg");
// const { it } = require('mocha');

const Pool = pg.Pool;



const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/waiter-availability';

const pool = new Pool({
    connectionString
});
let waiters = waiter_availability(pool);

describe('The waiter_availability web app', function () {

    beforeEach(async function () {
        await pool.query("delete from estratweni;");
        await pool.query("delete from waiters;");
        // await pool.query("delete from weekdays;");

    });


    it('should be able to insert waiters names in the db', async function () {

        await waiters.addWaiter('Nwabisa');


        assert.deepEqual([
            {
                waiter_name: "Nwabisa"
            }
        ],
            await waiters.getWaiter())

    });


    it('should add more than one waiters name in the db', async function () {

        await waiters.addWaiter('Nwabisa'),
            await waiters.addWaiter('Zola'),
            await waiters.addWaiter('Lulama'),
            await waiters.addWaiter('Mecayle')

        assert.deepEqual([
            {
                waiter_name: "Nwabisa"
            }
            ,

            {
                waiter_name: "Zola"
            }
            ,

            {
                waiter_name: "Lulama"
            }
            ,

            {
                waiter_name: "Mecayle"
            }
        ],
            await waiters.getWaiter())

    });


    it('should be able to select the days', async function () {

        await waiters.selectDays('Monday')
        await waiters.selectDays('Tuesday')
        await waiters.selectDays('Wednesday')
        await waiters.selectDays('Thursday')
        await waiters.selectDays('Friday')
        await waiters.selectDays('Saturday')
        await waiters.selectDays('Sunday')

        assert.deepEqual([
            {
                days: 'Monday'
            },
            {
                days: "Tuesday"
            },
            {
                days: "Wednesday"
            },
            {
                days: "Thursday"
            },
            {
                days: "Friday"
            },
            {
                days: "Saturday"
            },
            {
                days: "Sunday"
            }

        ],
            await waiters.getEachDay())


    });


    it('should be able to add the approiate color for each day', async function () {


        await waiters.selectDays('Monday', ['Zola']);
        await waiters.selectDays('Monday', ['Nwabisa']);
        await waiters.selectDays('Monday', ['Lulama'])

        assert.deepEqual([
            {
                day: 'Monday',
                waiters: ['Zola', 'Nwabisa', 'Lulama'],
                color: 'green'
            }
        ],
        
        await waiters.getEachWaiter())


    })








});