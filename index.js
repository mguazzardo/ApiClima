const express = require('express')
var axios = require('axios')
const app = express()
const port = process.env.PORT || 3003
const { check, validationResult } = require('express-validator');

app.use(express.json())
var ciudad = ""

var coches = [
    { id: 0, company: 'BMW', model: 'X3', year: '2020' },
    { id: 1, company: 'Audi', model: 'A1', year: '2021' },
    { id: 2, company: 'Mercedes', model: 'Clase A', year: '2022' }
]

app.get('/:ciudad', function (req, res) {
    ciudad = req.params.ciudad
    var config = {
        method: 'get',
        url: 'http://api.openweathermap.org/data/2.5/weather?q='+ciudad+'&appid=e898b7ae111271012246ee8cdfab5a4a',
        headers: { }
      };
      console.log("Ciudad " + req.params.ciudad)
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        res.send(JSON.stringify(response.data))
      })
      .catch(function (error) {
        console.log(error);
        res.send("Ciudad no encontrada")
      });    
})

app.get('/api/cars/list', (req, res) => {
    res.send(['BMW X1', 'AUDI A3', 'Mercedes Clase A'])
})

app.get('/api/cars/id/:id', (req, res) => {
    res.send(req.params.id)
})

app.get('/api/cars/:company/:model', (req, res) => {
    res.send(req.params)
})

app.get('/api/cars/', (req, res) => {
    res.send(coches)
})

app.get('/api/cars/:company', (req, res) => {
    const coche = coches.find(coche => coche.company === req.params.company)

    if (!coche) {
        res.status(404).send('No tenemos ningun coche de esa marca')
    } else {
        res.send(coche)
    }
})

app.post('/api/cars', (req, res) => {
    var carId = coches.length;
    var coche = {
        id: carId,
        company: req.body.company,
        model: req.body.model,
        year: req.body.year
    }
    coches.push(coche)
    res.status(201).send(coche)

})

app.post('/api/cars2', (req, res) => {
    if (!req.body.company || req.body.company.length < 3) {
        res.status(400).send('Introduce la empresa correcto')
        return
    }

    var carId = coches.length;
    var coche = {
        id: carId,
        company: req.body.company,
        model: req.body.model,
        year: req.body.year
    }

    coches.push(coche)
    res.status(201).send(coche)

})

app.post('/api/cars3', [
    check('company').isLength({ min: 3 }),
    check('model').isLength({ min: 3 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    var carId = coches.length;
    var coche = {
        id: carId,
        company: req.body.company,
        model: req.body.model,
        year: req.body.year
    }

    coches.push(coche)
    res.status(201).send(coche)

})

app.put('/api/cars/:id', [
    check('company').isLength({ min: 3 }),
    check('model').isLength({ min: 3 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const coche = coches.find(coche => coche.id === parseInt(req.params.id))

    if (!coche) {
        return res.status(404).send('El coche con ese ID no esta')
    }

    coche.company = req.body.company
    coche.model = req.body.model
    coche.year = req.body.year

    res.status(204).send()

})

app.delete('/api/cars/:id', (req, res) => {
    const coche = coches.find(coche => coche.id === parseInt(req.params.id))

    if (!coche) {
        return res.status(404).send('El coche con ese ID no esta, no se puede borrar')
    }

    const index = coches.indexOf(coche)
    coches.splice(index, 1)
    res.status(200).send('coche borrado')

})

app.listen(port, () => console.log('Escuchando Puerto: ' + port))