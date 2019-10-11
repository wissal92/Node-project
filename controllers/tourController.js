const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();

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