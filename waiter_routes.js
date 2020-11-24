module.exports = function waiterRoutes(waiter) {
    const _ = require('lodash');


    async function index(req, res) {

        res.render('index')

    };

    async function enter(req, res) {

        res.render('enter', {

        })
    }

    async function getShifts(req, res) {

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




    };

    async function selectShifts(req, res) {
        const user = _.capitalize(req.params.username)
        const days = req.body.weekdays
        var select = await waiter.selectDays(user, days)
        const weekdays = await waiter.getDays()
        const waiter_id = await waiter.waiterID(user)
        const getCheckedDays = await waiter.checkedShifts(waiter_id)

        try {
            if (!days) {
                req.flash('error', 'Please select your shift days')
            } else {
                req.flash('success', `${user}, you have successfully submitted your shift days`)
            }

            res.render('waiter', {
                select,
                weekdays,
                getCheckedDays
            })

        } catch (error) {

        }

    };

    async function reset(req, res) {

        req.flash('success', 'You have successfully cleared the data')
        await waiter.reset()
        const insert = await waiter.getEachWaiter()



        res.render('administrator', {
            insert
        })

    };

    async function getSchedule(req, res) {

        const insert = await waiter.getEachWaiter()

        res.render('administrator', {
            insert

        })

    };





    return {
        index,
        enter,
        getShifts,
        selectShifts,
        reset,
        getSchedule

    }

}