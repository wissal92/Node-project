const fs = require('fs');
const express = require('express');

const app = express();

//this middleware gives us access to data of the body without it req.body would not work
app.use(express.json());

//we write it here because we want it to only gets executed once(right after the app starts up)
const tours = JSON.parse(fs.readFileSync(__dirname + '/dev-data/data/tours-simple.json'));

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
      status: 'success', 
      results: tours.length,
      data: {
        tours
       }
    });
});

app.post('/api/v1/tours', (req, res) => {
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

})

app.get('/api/v1/tours/:id', (req, res) => {
      //we use this trick to convert a string into a number(by type coercion):
      const id = req.params.id * 1;
      const tour = tours.find(el => el.id === id);
   
      if(!tour) {
         return res.status(404).json({
             status: 'fail',
             message: 'Invalid Id'
         })
      }
      res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
})

//Put and Patch are both used to update data the difference between them is that
//with PUT our app receives the entire new updated object. unlike with PATCH
//which receives only the properties that should be updated on the Object

app.patch('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;
    const found = tours.filter(el => el.id === id); 
    if(found.length === 0){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    })
})

app.delete('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;
    const found = tours.filter(el => el.id === id); 
    if(found.length === 0){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
})

const port = 3000;
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});