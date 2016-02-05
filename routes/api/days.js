var router = require('express').Router();


// API endpoint for all days
router.get('/', function(req, res, next) {
  console.log('made a request to get a list of all days');
})


// API endpoints for day

router.post('/:day', function(req, res, next) {

});

router.get('/:day', function(req, res, next) {

});

router.delete('/:day', function(req, res, next) {

});


// API endpoints for attractions
router.post('/:day/:attractionType/:attraction', function(req, res, next) {

});

router.delete('/:day/:attractionType/:attraction', function(req, res, next) {

});


module.exports = router;