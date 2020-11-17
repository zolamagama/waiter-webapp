const { functions, eachRight } = require("lodash");

module.exports = function (pool) {

    async function addWaiter(waiter) {

        const insertName = await pool.query('insert into waiters (waiter_name) values ($1)', [waiter])
        return insertName.rows;
    }

    async function getWaiter() {

        const name = await pool.query('select waiter_name from waiters');
        return name.rows;

    }

    async function getWaiterForEachDay (waiter) {
        const each = await pool.query('select * from estratweni where waiters_id = $1', [waiter]);
        return each.rows
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

        const getID = await pool.query('select DISTINCT days,waiter_name from estratweni join waiters on estratweni.waiters_id = waiters.id join weekdays on estratweni.weekdays_id = weekdays.id')
        return getID.rows

    }



    async function selectDays(waiterID, days) {

        const waiter_id = await pool.query('select id from waiters where waiter_name = $1', [waiterID])
        const id = waiter_id.rows[0].id;
        for (let i = 0; i < days.length; i++) {
            const dayName = days[i];
            var shift_id = await shiftsID(dayName)

            console.log(dayName, shift_id)
            await pool.query('insert into estratweni (waiters_id, weekdays_id) values ($1, $2)', [id, shift_id]);
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
            if (wave.day === shifts[i].days) {
                wave.waiters.push(shifts[i].waiter_name);
            }
            if (wave.waiters.length === 3) {
                wave.color = 'green'
            }
            if (wave.waiters.length === 2) {
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


const displayData = async () => {
    let d = [];
    let admin = await getEachWaiter();
    admin.forEach(element => {
        console.log(element.waiters + " Zola");
        d.push(element.waiters);
    });
    // console.log(admin);
    // for (const days of admin) {
    //     console.log(days.waiters);
    //    return days.waiters;
    // }
    
    return d
}

    return {
        addWaiter,
        getWaiter,
        updateDays,
        selectDays,
        getDays,
        reset,
        getEstratweniId,
        getEachWaiter,
        getWaiterForEachDay,
        displayData

    }

}
