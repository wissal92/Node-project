const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const router = express.Router();

//our Alias Route:
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours)

//Aggregation pipeline routes:
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

//in order to protect routes we use a middleware that runs before our route: if the 
//user is not authenticated return an error, otherwise gives us the route

router
   .route('/')
   .get(authController.protect, tourController.getAllTours)
   .post(tourController.createTour);

router
   .route('/:id')
   .get(tourController.getTour)
   .patch(tourController.updateTour)
   .delete(tourController.deleteTour);

module.exports = router;