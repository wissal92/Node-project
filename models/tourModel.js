const mongoose = require('mongoose');
const slugify = require('slugify');

//Our Schema:
const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //=> we can pass an array if we want to display an error when this field is missing we call it a validator  
      unique: true,
      trim: true
    },
    slug: String,
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
    ratingsQuantity: {
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
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
},{
    //we add this object to add schema options like displaying the virtual properties
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//DOCUMENT MIDDLEWARE:
tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true});
    next();
});

//QUERY MIDDLEWARE:
//in this example if the tour is a secret(just for VIP) we don't wanna show it
//we created here a regular expression because we want this middleware to get run with all the commands that start with find
tourSchema.pre(/^find/, function(next){ //=> this keyword here will point to the current query not the current document
    this.find({secretTour: {$ne: true}});
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function(docs, next){
    console.log(`Query took ${Date.now() - this.start} milliseconds!`)
    console.log(docs);
    next();
});

//OUR VIRTUAL PROPERTY:
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
});

//Our Model:
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

