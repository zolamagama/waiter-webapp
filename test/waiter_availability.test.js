const assert = require('assert');

const waiter_availability = require('../waiter');

const pg = require("pg");
// const { it } = require('mocha');
const waiter = require('../waiter');
// const { it } = require('mocha');

const Pool = pg.Pool;



const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/waiter_availability_test';

const pool = new Pool({
    connectionString
});

describe('The waiter_availability web app', function () {

    beforeEach(async function () {
        await pool.query("delete from estratweni;");
        // await pool.query("delete from waiters;");
        // await pool.query("delete from weekdays;");

    });



    it('should add more than one waiters name in the db', async function () {
        let waiters = waiter_availability(pool);

        await waiters.addWaiter('Zola'),
            await waiters.addWaiter('Lulama'),
            await waiters.addWaiter('Nwabisa'),
            await waiters.addWaiter('Yongama'),


            assert.deepEqual([
                {
                    waiter_name: "Zola"
                },
                {
                    waiter_name: "Lulama"
                }
                ,
                {
                    waiter_name: "Nwabisa"
                }
                ,

                {
                    waiter_name: "Yongama"
                }

            ],
                await waiters.getWaiter())

    });


    it('should be able to show the days a waiter selected', async function () {
        let waiters = waiter_availability(pool);


        await waiters.addWaiter('Zola'),
            await waiters.addWaiter('Lulama'),
            await waiters.addWaiter('Nwabisa'),
            await waiters.addWaiter('Yongama')

        await waiters.selectDays('Zola', ["Tuesday"])
        await waiters.selectDays('Lulama', ["Tuesday"])
        await waiters.selectDays('Nwabisa', ["Friday"])
        await waiters.selectDays('Yongama', ["Friday"])






        assert.deepEqual(

            [
                {
                    "color": "orange",
                    "day": "Monday",
                    "id": 0,
                    "waiters": []
                },
                {
                    "color": "orange",
                    "day": "Tuesday",
                    "id": 1,
                    "waiters": ["Lulama", "Zola"]
                },
                {
                    "color": "orange",
                    "day": "Wednesday",
                    "id": 2,
                    "waiters": []
                },
                {
                    "color": "orange",
                    "day": "Thursday",
                    "id": 3,
                    "waiters": []
                },
                {
                    "color": "orange",
                    "day": "Friday",
                    "id": 4,
                    "waiters": ["Nwabisa", "Yongama"]
                },
                {
                    "color": "orange",
                    "day": "Saturday",
                    "id": 5,
                    "waiters": [],
                },
                {
                    "color": "orange",
                    "day": "Sunday",
                    "id": 6,
                    "waiters": []
                }

            ],
            await waiters.getEachWaiter())


    });


    it('should be able to show a red color for when a day has over subscribed waiters', async function () {
        let waiters = waiter_availability(pool);

        await waiters.addWaiter('Zola'),
            await waiters.addWaiter('Lulama'),
            await waiters.addWaiter('Nwabisa'),
            await waiters.addWaiter('Yongama')
        //   await waiters.getDays("Tuesday")
        await waiters.selectDays('Zola', ["Tuesday"])
        await waiters.selectDays('Lulama', ["Tuesday"])
        await waiters.selectDays('Nwabisa', ["Tuesday"])
        await waiters.selectDays('Yongama', ["Tuesday"])


        assert.deepEqual(
            [
                {
                    "color": "orange",
                    "day": "Monday",
                    "id": 0,
                    "waiters": []
                },
                {
                    "color": "red",
                    "day": "Tuesday",
                    "id": 1,
                    "waiters": ["Lulama", "Nwabisa", "Yongama", "Zola",]
                },
                {
                    "color": "orange",
                    "day": "Wednesday",
                    "id": 2,
                    "waiters": []
                },
                {
                    "color": "orange",
                    "day": "Thursday",
                    "id": 3,
                    "waiters": []
                },
                {
                    "color": "orange",
                    "day": "Friday",
                    "id": 4,
                    "waiters": []
                },
                {
                    "color": "orange",
                    "day": "Saturday",
                    "id": 5,
                    "waiters": [],
                },
                {
                    "color": "orange",
                    "day": "Sunday",
                    "id": 6,
                    "waiters": []
                }

            ],

            await waiters.getEachWaiter())


    })

        it('should be able to show a green color for when enough waiters', async function () {
            let waiters = waiter_availability(pool);

            await waiters.addWaiter('Zola'),
                await waiters.addWaiter('Lulama'),
                await waiters.addWaiter('Nwabisa'),
                await waiters.addWaiter('Yongama')

            //   await waiters.getDays("Tuesday")
            await waiters.selectDays('Zola', ["Friday"])
            await waiters.selectDays('Lulama', ["Friday"])
            await waiters.selectDays('Nwabisa', ["Friday"])
            await waiters.selectDays('Yongama', ["Monday"])



            assert.deepEqual(
                [
                    {
                        "color": "orange",
                        "day": "Monday",
                        "id": 0,
                        "waiters": ["Yongama"]
                    },
                    {
                        "color": "orange",
                        "day": "Tuesday",
                        "id": 1,
                        "waiters": []
                    },
                    {
                        "color": "orange",
                        "day": "Wednesday",
                        "id": 2,
                        "waiters": []
                    },
                    {
                        "color": "orange",
                        "day": "Thursday",
                        "id": 3,
                        "waiters": []
                    },
                    {
                        "color": "green",
                        "day": "Friday",
                        "id": 4,
                        "waiters": ["Lulama",
                            "Nwabisa",
                            "Zola"]
                    },
                    {
                        "color": "orange",
                        "day": "Saturday",
                        "id": 5,
                        "waiters": [],
                    },
                    {
                        "color": "orange",
                        "day": "Sunday",
                        "id": 6,
                        "waiters": []
                    }

                ],

                await waiters.getEachWaiter())


        })

        it('should be able to show a orange color for when waiters are still needed', async function () {
            let waiters = waiter_availability(pool);

            await waiters.addWaiter('Zola'),
                await waiters.addWaiter('Lulama'),
                await waiters.addWaiter('Nwabisa'),
                await waiters.addWaiter('Yongama')

            await waiters.selectDays('Zola', ["Monday"])
            await waiters.selectDays('Lulama', ["Monday"])
            await waiters.selectDays('Nwabisa', ["Sunday"])
            await waiters.selectDays('Yongama', ["Saturday"])




            assert.deepEqual(
                [
                    {
                        "color": "orange",
                        "day": "Monday",
                        "id": 0,
                        "waiters": ["Lulama", "Zola"]
                    },
                    {
                        "color": "orange",
                        "day": "Tuesday",
                        "id": 1,
                        "waiters": []
                    },
                    {
                        "color": "orange",
                        "day": "Wednesday",
                        "id": 2,
                        "waiters": []
                    },
                    {
                        "color": "orange",
                        "day": "Thursday",
                        "id": 3,
                        "waiters": []
                    },
                    {
                        "color": "orange",
                        "day": "Friday",
                        "id": 4,
                        "waiters": []
                    },
                    {
                        "color": "orange",
                        "day": "Saturday",
                        "id": 5,
                        "waiters": ["Yongama"],
                    },
                    {
                        "color": "orange",
                        "day": "Sunday",
                        "id": 6,
                        "waiters": ["Nwabisa"]
                    }

                ],

                await waiters.getEachWaiter())


        })




        it('should be able to get the id of the day', async function () {
            let waiters = waiter_availability(pool);

            await waiters.checkedShifts()

            await waiters.getEachDay("Friday")
            const shift_id = await waiters.shiftsID("Friday")


            assert.deepEqual(5, shift_id)

        });

        it('should be able to reset the data from admin', async function(){
            let waiters = waiter_availability(pool);

            await waiters.addWaiter('Zola'),
            await waiters.addWaiter('Lulama'),
            await waiters.addWaiter('Nwabisa'),
            await waiters.addWaiter('Yongama')

            await waiters.selectDays('Zola', ["Monday"])
            await waiters.selectDays('Lulama', ["Monday"])
            await waiters.selectDays('Nwabisa', ["Sunday"])
            await waiters.selectDays('Yongama', ["Saturday"])

            await waiters.reset()

            assert.deepEqual([
                  {
                    "color": "",
                    "day": "Monday",
                    "id": 0,
                    "waiters": []
                  },
                  {
                    "color": "",
                    "day": "Tuesday",
                    "id": 1,
                    "waiters": []
                  },
                  {
                    "color": "",
                    "day": "Wednesday",
                    "id": 2,
                    "waiters": []
                  },
                  {
                    "color": "",
                    "day": "Thursday",
                    "id": 3,
                    "waiters": []
                  },
                  {
                    "color": "",
                    "day": "Friday",
                    "id": 4,
                    "waiters": []
                  },
                  {
                    "color": "",
                    "day": "Saturday",
                    "id": 5,
                    "waiters": []
                  },
                  {
                    "color": "",
                    "day": "Sunday",
                    "id": 6,
                    "waiters": []
                  },
                ]
          , await waiters.getEachWaiter())



        });



});