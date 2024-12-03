const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema , reviewSchema } = require('../schema.js');
const Listing = require('../models/listing.js');
const passport = require('passport');
const {isLoggedIn, isOwner} = require('../middleware.js');

const listingController = require('../controllers/listings.js');

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    next();
};

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn , validateListing , wrapAsync(listingController.createListing));

//new route
router.get("/new", isLoggedIn ,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn , isOwner,wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",isLoggedIn , isOwner ,wrapAsync(listingController.renderEditForm));

module.exports = router;