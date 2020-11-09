
module.exports = function (pool) {

    async function addWaiter(waiter) {

        const weekdays = await pool.query('select id from weekdays where Days = $1', [waiter])
        const id = weekdays.rows[0].id
        let confirmed;

        if (confirmed.rowCount < 0) {

            await pool.query('insert into waiter (waiter_name, days_selected) values ($1, $2)', [waiter, id])
        }
        else {
            return false
        }

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
