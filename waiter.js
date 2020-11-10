
module.exports = function (pool) {

    async function addWaiter(waiter) {

        const insertName = await pool.query('insert into waiters (waiters_name) values ($1)', [waiter])
        return insertName.rows;
    }

    async function getWaiter() {

        const name = await pool.query('select waiter_name from waiters');
        return name.rows;

    }

    async function getDays() {

        const days = await pool.query('select days_selected from waiters');
        return days.rows;

    }

    async function updateDays(waiter) {

        const update = await pool.query('update weekdays set days = days+1', [waiter]);
        return update.rowCount;

    }




    return {
        addWaiter,
        getWaiter,
        updateDays,
        getDays

    }

}
