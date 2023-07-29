const express = require('express');

const router = express.Router();

router.get('/', (req, res, next)=>{
    console.log('GET request in place');
    //The json() method below takes any data that can converted to a json. 
    //e.g. object, array, number, string, boolean
    res.json({message: 'It works'});
});

module.exports = router;