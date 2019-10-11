const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
    try {
        //building the query
        //1)Filtering:
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        
        //2)Advanced filtering:
        //when using operators in our queries and log res.query we get { duration: { gte: '5' }, difficulty: 'easy' }
        //to make it work we just need $ in front of our operator and to do that:
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));

        //3)Sorting:
        //we want to sort our documents based on the price(ascending order) but if
        // we want it in a descending order we just add - before price in our query
        if(req.query.sort){
            //query = query.sort(req.query.sort)

            //in case there is a tie we could add another criteria:
            //we just add it to our query we need to put a comma before it ex:
            //127.0.0.1:3000/api/v1/tours?sort=-price,ratingsAverage
            //then in our code to get ride of the comma we write this logic:
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

       
        
        //executing the query:
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