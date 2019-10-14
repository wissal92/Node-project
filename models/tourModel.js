const mongoose = require('mongoose');
const slugify = require('slugify');

//Our Schema:
const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //=> we can pass an array if we want to display an error when this field is missing we call it a validator  
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have at least 10 characters']
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
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
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
tourSchema.pre(/^find/, function(next){ 
    this.find({secretTour: {$ne: true}});
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function(docs, next){
    console.log(`Query took ${Date.now() - this.start} milliseconds!`)
    next();
});

//AGGREGATION MIDDLEWARE:
//in this example we want to exclude the secret tour in tour-stats where we have used aggregation pipeline
tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({$match: {secretTour: {$ne: true}}})
    console.log(this); //this here is going to point to the current aggregation object
    next();
});
//OUR VIRTUAL PROPERTY:
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
});

//Our Model:
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

