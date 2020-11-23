// const { functions, eachRight } = require("lodash");

module.exports = function (pool) {

    async function addWaiter(waiter) {
        const takeName = await pool.query('select id from waiters where waiter_name = $1', [waiter])
        if (takeName.rowCount === 0)
            await pool.query('insert into waiters (waiter_name) values ($1)', [waiter])
    }

    async function getWaiter() {

        const name = await pool.query('select waiter_name from waiters');
        return name.rows;

    }


    async function shiftsID(days) {
        if (days) {
            const day_id = await pool.query('select id from weekdays where days = $1', [days])
            return day_id.rows[0].id

        } else {
            return false
        }


    }

    async function waiterID(waiter) {
        const waiters_id = await pool.query('select id from waiters where waiter_name = $1', [waiter])
        return waiters_id.rows[0].id


    }

    async function checkedShifts(id) {

        const check_id = await pool.query('select * from weekdays join estratweni on weekdays.id = estratweni.weekdays_id where waiters_id = $1', [id])
        return check_id.rows;

    }

    async function getEstratweniId() {

        const getID = await pool.query('select DISTINCT days,waiter_name from estratweni join waiters on estratweni.waiters_id = waiters.id join weekdays on estratweni.weekdays_id = weekdays.id')
        return getID.rows

    }

    async function getDaysId() {
        const day_id = await pool.query('select days from estratweni join waiters on estratweni.waiters_id = waiters.id join weekdays on estratweni.weekdays_id = weekdays.id');
        return day_id.rows
    }


    async function selectDays(waiter, days) {

        const name = await pool.query('select id from waiters where waiter_name = $1', [waiter])
        const employee_id = name.rows[0].id

        await pool.query('delete from estratweni where waiters_id = $1', [employee_id])
        for (let i = 0; i < days.length; i++) {

            const waiter_id = await waiterID(waiter)
            const weekdays_id = await shiftsID(days[i])

            await pool.query('insert into estratweni (waiters_id, weekdays_id) values ($1, $2)', [waiter_id, weekdays_id]);
        }

    }

    async function getEachWaiter() {

        let shifts = await getEstratweniId();
        var insert = [{
            id: 0,
            day: 'Monday',
            waiters: [],
            color: '',
        }, {
            id: 1,
            day: 'Tuesday',
            waiters: [],
            color: '',
        }, {
            id: 2,
            day: 'Wednesday',
            waiters: [],
            color: '',
        }, {
            id: 3,
            day: 'Thursday',
            waiters: [],
            color: '',
        }, {
            id: 4,
            day: 'Friday',
            waiters: [],
            color: '',
        }, {
            id: 5,
            day: 'Saturday',
            waiters: [],
            color: '',
        }, {
            id: 6,
            day: 'Sunday',
            waiters: [],
            color: '',
        }
        ]
        if (shifts.length > 0) {
            for (let i = 0; i < shifts.length; i++) {
                insert.forEach(wave => {
                    // console.log(insert);
                    if (wave.day === shifts[i].days) {
                        wave.waiters.push(shifts[i].waiter_name);
                    }

                    if (wave.waiters.length === 3) {
                        wave.color = 'green'
                    }
                    if (wave.waiters.length <= 2) {
                        wave.color = 'orange'
                    }
                    if (wave.waiters.length > 3) {
                        wave.color = 'red'
                    }
                })
            }
        }

        return insert

    }

    async function getEachDay() {
        const twentyFourHors = await pool.query('select days from weekdays');
        return twentyFourHors.rows;
    }

    async function getDays() {
        const confirmedShifts = await pool.query('select * from weekdays');
        return confirmedShifts.rows;
    }


    async function reset() {

        const clear = await pool.query('delete from estratweni; delete from waiters');
        return clear.rows;
    }


    return {
        addWaiter,
        getDaysId,
        getWaiter,
        checkedShifts,
        selectDays,
        getDays,
        reset,
        getEstratweniId,
        getEachWaiter,
        waiterID,
        shiftsID,
        getEachDay

    }

}
