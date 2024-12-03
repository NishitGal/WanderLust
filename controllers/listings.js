const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs',{allListings});
};

module.exports.renderNewForm = async(req, res) => {
    res.render('listings/new.ejs');
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async (req, res) => {
    // Check if image is passed, if not set a default image
    if (!req.body.listing.image || typeof req.body.listing.image === 'string') {
        req.body.listing.image = {
            url: req.body.listing.image || 'https://plus.unsplash.com/premium_photo-1682377521625-c656fc1ff3e1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Default image URL
            filename: 'default_image_filename' // You can set a dynamic filename or a default one
        };
    }

    // Create a new Listing with the provided data
    const newListing = new Listing(req.body.listing);

    //addinf an owner
    newListing.owner = req.user._id;
    
    // Save the listing
    await newListing.save();

    req.flash('success','listing created');
    
    // Redirect to listings page after saving
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let  listing = await Listing.findById(id);
    
    // Check if the image field is being updated and if it's in the correct format
    if (req.body.listing.image && typeof req.body.listing.image === 'string') {
        // If it's just the URL, wrap it in the expected object format
        req.body.listing.image = {
            url: req.body.listing.image,
            filename: 'default_image_filename' // You can set a dynamic filename or default one
        };
    }
    
    // Update the listing
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    // Redirect after the update
    res.redirect(`/listings/${updatedListing._id}`);
};

module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id, {...req.body.listing});
    res.redirect("/listings");
};