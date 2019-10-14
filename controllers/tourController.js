const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apifeatures');

exports.aliasTopTours = async (req, res, next) => {
     req.query.limit = '5';
     req.query.sort = '-ratingsAverage,price';
     req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
     next();
}


exports.getAllTours = async (req, res) => {
    try {
        //executing the query:
        const features = new APIFeatures(Tour.find(), req.query)
           .filter()
           .sort()
           .limitFields()
           .paginate();

        const tours = await features.query;
        
        //send response:
        res.status(200).json({
        status: 'success',
        requestTime: req.requestTime, 
        results: tours.length,
        data: {
            tours
        }
        });
    } catch(err) {
        res.status(400).json({
            status: 'Fail',
            message: err
        })
    }
}

exports.createTour = async (req, res) => {
    try{
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch(err) {
        res.status(400).json({
            status: 'Failed',
            message: 'Invalid data :('
        })
    }
}

exports.getTour = async (req, res) => {
   try{
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch(err) {
        res.status(400).json({
            status: 'Failed',
            message: err
        })
    };
};

exports.updateTour = async (req, res) => {
    try{
        //findByIdAndUpdate is a mongoose method the third paramter is optional object with some configs
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true // => we set it to true so each time we update our document the validator that we specified in our schema will run again
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch(err) {
        res.status(400).json({
            status: 'Failed',
            message: err
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
      await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
        status: 'success',
        data: null
    });
   } catch (err) {
        res.status(400).json({
            status: 'Failed',
            message: err
        });
   }
};

//AGGREGATION PIPELINE:

exports.getTourStats = async(req, res) => {
    try{
        const stats = await Tour.aggregate([
            //aggregation pipeline stages: 
            {
                $match:{ratingsAverage: {$gte: 4.5}} //=> we use it to filter certain documents 
            },
            {
                $group:{ //=> allows us to group documents together using accumulators
                    //_id: null, //=> because we want to have everthing in one group 
                    _id: '$difficulty', //=>if we wanna group them based on difficulty
                    //_id: '$ratingsAverage', //=>if we want to group them based on rating
                    numTours: {$sum: 1}, 
                    numRatings: {$sum: '$rating'},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'},
                }
            },
            {   
                //=> with sort we have to use the names that we have used in the group
                $sort:  {avgPrice: 1} //=> we used 1 so that they can be sorted by ascending order   
                
            },
            {
                //we can also repeat stages if we want:
                $match: {_id: {$ne: 'EASY'}} //=> ne: means not equal
            }
        ]); 

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'Failed',
            message: err
        })
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try{
       const year = req.params.year * 1;  //2021
       const plan = await Tour.aggregate([
           {
               $unwind: '$startDates' //=>unwind allows us to take documents as input that have an array valued field and produces output documents for each value in tha array. 
           },
           {
               $match: {
                   startDates: {
                       $gte: new Date(`${year}-01-01`),
                       $lte: new Date(`${year}-12-31`),
                   }
               }
           },
           {
               $group: {
                     //we want to calc the number of trips in each month on 2021
                   _id: {$month: '$startDates'}, //$month: it's an aggregation pipeline operator we use it to extract just the month from the date
                   numTourStarts: {$sum: 1},
                   tours: {$push: '$name'}, //$push: will create an array and push to it the name of our tours in this month 
               }
           },
           {
               $addFields: {month: '$_id'} //=> we use it to add fields
           },
           {
               $project: {
                   _id: 0 //=> we set it to 0 so that the id does not shows up anymore
               }
           },
           {
               $sort: {numTourStarts: -1} //we used - to get the results in a decending order
           },
        //    {
        //        $limit: 6 //=> we use it to limit the number of documents to what we want
        //    }
       ]);
       res.status(200).json({
           status: 'success',
           data: {
               plan
           }
       });
    }catch(err){
        res.status(400).json({
            status: 'Failed',
            message: err
        })
    }
}