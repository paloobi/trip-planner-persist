var router = require('express').Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;


// API endpoint for all days
router.get('/', function(req, res, next) {
	Day.find({})
	.populate('hotel restaurants activities')
	.then(function(allDays) {
		res.json(allDays);
	}).then(null, next);
})


// API endpoints for day

router.post('/:day', function(req, res, next) {
	Day.create({
		number: req.params.day
	}).then(null, next);
});

router.get('/:day', function(req, res, next) {
	Day.findOne({ number: req.params.day })
	.then(function(data) {
		res.json(data);
	})
	.then(null, next);
});

router.delete('/:day', function(req, res, next) {
	Day.findOne({ number: Number(req.params.day) })
	.then(function(day){
		return day.remove();
	})
	.then(null, next);
});


// API endpoints for attractions
router.post('/:day/:attractionType/:attraction', function(req, res, next) {
	Day.findOne({ number: Number(req.params.day) })
	.then(function(day){
		var type = req.params.attractionType;
		if (type === 'hotel') {
			day[type] = req.params.attraction;
		} else {
			if (day[type].indexOf(req.params.attraction) === -1) day[type].push(req.params.attraction);
		}
		return day.save();
	}).then(null, next);
});

router.delete('/:day/:attractionType/:attraction', function(req, res, next) {
	Day.findOne({ number: Number(req.params.day )})
	.then(function(day){
		var type = req.params.attractionType;
		if(type === 'hotel') day[type] = null;
		else day[type].pull(req.params.attraction);
		return day.save();
	})
	.then(null, next);
});


module.exports = router;