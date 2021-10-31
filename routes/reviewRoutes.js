const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// GET /tour/124214ad/reviews
// POST /tour/124214ad/reviews
// POST /reviews

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authController.protect, reviewController.changeReview)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    reviewController.deleteReview
  );

module.exports = router;
