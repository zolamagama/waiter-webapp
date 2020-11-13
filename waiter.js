
module.exports = function (pool) {

    async function addWaiter(waiter) {

        const insertName = await pool.query('insert into waiters (waiter_name) values ($1)', [waiter])
        return insertName.rows;
    }

    async function getWaiter() {

        const name = await pool.query('select waiter_name from waiters');
        return name.rows;

    }

    async function shiftsID(days) {
        try {
            if (days) {
                const day_id = await pool.query('select id from weekdays where days = $1', [days])
                return day_id.rows[0].id

            } else {
                return false
            }

        } catch (error) {
            console.log(error);
        }

    }

    async function getEstratweniId() {

        const getID = await pool.query('select DISTINCT days,waiter_name from estratweni join waiters on estratweni.waiters_id = waiters.id join weekdays on estratweni.weekdays_id = weekdays.id ;')
        return getID.rows

    }



    async function selectDays(waiterID, days) {

        const waiter_id = await pool.query('select id from waiters where waiter_name = $1', [waiterID])
        const days_id = waiter_id.rows[0].id;
        for (let i = 0; i < days.length; i++) {
            const dayName = days[i];
            var shift_id = await shiftsID(dayName)

            console.log(dayName, shift_id)
            await pool.query('insert into estratweni (waiters_id, weekdays_id) values ($1, $2)', [days_id, shift_id]);
        }

    }

    async function getEachWaiter(waiter) {

        waiter.forEach(name => {
            
        });
            
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

        const clear = await pool.query('delete from waiters');
        return clear.rows;
    }




    return {
        addWaiter,
        getWaiter,
        updateDays,
        selectDays,
        getDays,
        reset,
        getEstratweniId,
        getEachWaiter

    }

}
