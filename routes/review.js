const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema , reviewSchema } = require('../schema.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const { isLoggedIn } = require('../middleware.js');
const { createReview, destroyReview } = require('../controllers/reviews.js');

const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    next();
};

//review post route
router.post("/", isLoggedIn, validateReview ,wrapAsync(createReview));

//Delete review route
router.delete("/:reviewId" , isLoggedIn, wrapAsync(destroyReview));

module.exports = router;