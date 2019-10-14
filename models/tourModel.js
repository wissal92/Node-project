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
    startDates: [Date]
},{
    //we add this object to add schema options like displaying the virtual properties
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//DOCUMENT MIDDLEWARE: runs befor .save() and .create() we can act on the data before it is saved to the database
//slug => is a string that we can put in the url based on some strings like the name
tourSchema.pre('save', function(next){ // => every middleware function has access to next so if we have more that one middlware on the stack we should use next
    //console.log(this) //=> it is going to point to the current processed document
    this.slug = slugify(this.name, {lower: true});
    next();
});

tourSchema.pre('save', function(next){
    console.log('Will save document...')
    next();
});

//post middleware functions are executed after all pre middleware functions are executed
//that is why we have acces to the finished document:
tourSchema.post('save', function(doc, next){
    console.log(doc);
    next();
});

//OUR VIRTUAL PROPERTY:
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
});

//Our Model:
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

