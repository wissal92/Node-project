const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

//this middleware would not run unless there is a special param in the url in this case the id
//in a param middleware function we also have access to a fourth argument => 
//which is the value of the param that we want 
router.param('id', tourController.checkID);


router
   .route('/')
   .get(tourController.getAllTours)
   .post(tourController.createTour);

router
   .route('/:id')
   .get(tourController.getTour)
   .patch(tourController.updateTour)
   .delete(tourController.deleteTour);

module.exports = router;