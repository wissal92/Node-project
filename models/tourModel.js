const mongoose = require('mongoose');

//Our Schema:
const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //=> we can pass an array if we want to display an error when this field is missing we call it a validator  
      unique: true,
      trim: true
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a max group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsAverage: {
        type: Number,
        default: 0
    },
    rating: {
      type: Number,
      default: 4.5
    },
    price: {
      type: Number,
      required:[true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required:[true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required:[true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date]
},{
    //we add this object to add schema options like displaying the virtual properties
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//OUR VIRTUAL PROPERTY:
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
});

//Our Model:
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

