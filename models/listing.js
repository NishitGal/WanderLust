const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new mongoose.Schema({
    title : {
        type : String,
    },
    description : String,
    image: {
        type: {
            filename: { type: String, required: false },
            url: { type: String, required: true }
        },
        default: {
            filename: 'default-image', // Placeholder filename
            url: 'https://images.unsplash.com/photo-1730386114645-1548682d1577?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMHx8fGVufDB8fHx8fA%3D%3D'
        }
    },      
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        // Delete reviews that are associated with the listing
        await Review.deleteMany({
            _id: { $in: listing.reviews } // Correct way to match multiple ObjectIds
        });
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
