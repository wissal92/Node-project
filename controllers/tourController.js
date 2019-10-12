const Tour = require('./../models/tourModel');

//the middleware that would handle aliasing 
exports.aliasTopTours = async (req, res, next) => {
     req.query.limit = '5';
     req.query.sort = '-ratingsAverage,price';
     req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
     next();
}

exports.getAllTours = async (req, res) => {
    try {
        //********** building the query ***************
        //1)Filtering:
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        
        //2)Advanced filtering:
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));

        //3)Sorting:
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        //4)Field Limiting:
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        //5)Pagination:
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 10;
        const skip = (page -1) * limit;
       
        query = query.skip(skip).limit(limit);

        if(req.query.page){
            const numTours = await Tour.countDocuments(); //CountDocuments method returns the number of document that we have in our db 
            if(skip >= numTours) throw new Error('This page does not exist');
        }

        //6)Aliasing: is to provide an alias route to a request that it is poplular
        //EX: like providing a route for the five best cheap tours => ?limit=5&sort=-ratingsAverage,price

        // *************** executing the query **********************
        const tours = await query;
        
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
        //first way =>:
        //const newTour = new Tour({})
        //newTour.save()

        //second way =>:
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
        //we could also use: Tour.findOne({_id: req.params.id}) => findById is
        //a mongoose method it's a shorthand for findOne in mongo

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