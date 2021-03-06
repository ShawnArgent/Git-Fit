const router = require('express').Router()
const { User } = require('../models')
const { findAllWorkouts, findWorkoutById } = require('../util/workoutApi')

// use withAuth middleware to redirect from protected routes.
const withAuth = require('../util/withAuth')
const { json } = require('express/lib/response')

// example of a protected route
// router.get("/users-only", withAuth, (req, res) => {
//   // ...
// });
// I am adding this comment to have at least one change to commit my code as long as my code is working good

router.get('/', async(req, res) => {
    try {
        let user
        if (req.session.isLoggedIn) {
            user = await User.findByPk(req.session.userId, {
                exclude: ['password'],
                raw: true,
            })
        }
        res.render('home', {
            title: 'Home Page',
            isLoggedIn: req.session.isLoggedIn,
            user,
        })
    } catch (error) {
        console.error(error)
        res.status(500).send('⛔ Uh oh! An unexpected error occurred.')
    }
})

router.get('/login', (req, res) => {
    res.render('login', { title: 'Log-In Page' })
})

router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign-Up Page' })
})

router.get('/workoutform', withAuth, async(req, res) => {
    const workoutData = await findAllWorkouts()
    res.render('workoutform', {
        workouts: workoutData.results,
        title: 'Workout Form Page',
        isLoggedIn: req.session.isLoggedIn,
    })
})

router.get('/workout', async(req, res) => {
    const workoutDataId = await findWorkoutById(req.query.workoutId)
    console.log(workoutDataId.day_list[0].set_list[0].exercise_list[0])
    res.render('workout', {
        workout: workoutDataId.day_list[0].set_list,
        title: 'Workout Page',
        isLoggedIn: req.session.isLoggedIn,
    })
})
module.exports = router