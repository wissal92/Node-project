const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(__dirname + '/../dev-data/data/tours-simple.json'));

exports.checkID = (req, res, next, val) => {
     //we use this trick to convert a string into a number(by type coercion)
    const id = val * 1;
    const found = tours.filter(el => el.id === id); 
   if(found.length === 0){
       return res.status(404).json({
           status: 'fail',
           message: 'Invalid'
       });
   }
   next();
}

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
      status: 'success',
      requestTime: req.requestTime, 
      results: tours.length,
      data: {
        tours
       }
    });
}

exports.createTour = (req, res) => {
    const newId = Math.floor(Math.random() * 10000);
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour);
    fs.writeFile(__dirname + '/dev-data/data/tours-simple.json',
        JSON.stringify(tours),
        err => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            });
        }
    );

}

exports.getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);
    res.status(200).json({
      status: 'success',
      data: {
          tour
      }
  });
}

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    })
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    });
};