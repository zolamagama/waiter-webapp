
module.exports = function (pool) {

    async function addWaiter(waiter) {

        const insertName = await pool.query('insert into waiters (waiter_name) values ($1)', [waiter])
        return insertName.rows;
    }

    async function getWaiter() {

        const name = await pool.query('select waiter_name from waiters');
        return name.rows;

    }


    async function selectDays(weekdays) {

        const shifts = await pool.query('select days from weekdays where days = $1', [weekdays]);
        return shifts.rows
    }
    async function getDays() {
        const confirmedShifts = await pool.query('select days from weekdays');
        return confirmedShifts.rows;
    }

    async function updateDays(waiter) {

        const update = await pool.query('update weekdays set days = days+1', [waiter]);
        return update.rowCount;

    }

    async function reset() {

        const clear = await pool.query('delete from estratweni');
        return clear.rows;
    }




    return {
        addWaiter,
        getWaiter,
        updateDays,
        selectDays,
        getDays,
        reset

    }

}
