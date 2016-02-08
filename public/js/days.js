  'use strict';
/* global $ utilsModule */

var daysModule = (function(){

  var days = [],
      currentDay;

  // jQuery selections

  var $dayButtons, $dayTitle, $addButton, $removeButton;
  $(function(){
    $dayButtons = $('.day-buttons');
    $dayTitle = $('#day-title > span');
    $addButton = $('#day-add');
    $removeButton = $('#day-title > button.remove');
  });

  // Day class and setup

  function Day () {
    this.hotel = null;
    this.restaurants = [];
    this.activities = [];
    this.number = days.push(this);
    this.buildButton().drawButton();
  }

  Day.prototype.saveToDB = function() {
    $.post('/api/days/'+this.number, function() {
      console.log('sent to be saved to db');
    });
  }

  Day.prototype.buildButton = function() {
    this.$button = $('<button class="btn btn-circle day-btn"></button>')
      .text(this.number);
    var self = this;
    this.$button.on('click', function(){
      this.blur(); // removes focus box from buttons
      self.switchTo();
    });
    return this;
  };

  Day.prototype.drawButton = function() {
    this.$button.appendTo($dayButtons);
    return this;
  };

  Day.prototype.hideButton = function() {
    this.$button.detach();
    return this;
  };

  // day switching

  Day.prototype.switchTo = function () {
    currentDay.hide();
    currentDay = this;
    currentDay.draw();
  };

  Day.prototype.draw = function () {
    // day UI
    this.$button.addClass('current-day');
    $dayTitle.text('Day ' + this.number);
    // attractions UI
   function draw (attraction) { attraction.draw(); }
    if (this.hotel) draw(this.hotel);
    this.restaurants.forEach(draw);
    this.activities.forEach(draw);
  };

  Day.prototype.hide = function () {
    // day UI
    this.$button.removeClass('current-day');
    $dayTitle.text('Day not Loaded');
    // attractions UI
    function hide (attraction) { attraction.hide(); }
    if (this.hotel) hide(this.hotel);
    this.restaurants.forEach(hide);
    this.activities.forEach(hide);
  };

  // jQuery event binding

  $(function(){
    $addButton.on('click', addDay);
    $removeButton.on('click', deleteCurrentDay);
  });

  function addDay (init) {
    if (this && this.blur) this.blur(); // removes focus box from buttons
    var newDay = new Day();
    if (days.length === 1) currentDay = newDay;
    newDay.switchTo();
    if (!init || typeof init === 'object') {
      newDay.saveToDB();
    }
  }

  function deleteCurrentDay () {
    if (days.length < 2 || !currentDay) return;
    var index = days.indexOf(currentDay),
      previousDay = days.splice(index, 1)[0],
      newCurrent = days[index] || days[index - 1];
    days.forEach(function (day, idx) {
      day.number = idx + 1;
      day.$button.text(day.number);
    });

    $.ajax({
        method: 'DELETE',
        url: '/api/days/'+currentDay.number,
        success: function(data) {
          console.log(data);
        }
      })
    newCurrent.switchTo();
    previousDay.hideButton();
   }


  // globally accessible module methods

  var methods = {

    load: function(){
      $.get('/api/days', function(allDays) {
        if (allDays.length > 0) {
          allDays.forEach(function(day, index){
            var newDay = new Day();
            if (days.length === 1) currentDay = newDay;
            if (day.hotel) {
              day.hotel.type = 'hotel';
              newDay.hotel = attractionsModule.create(day.hotel);
              newDay.hotel.type = 'hotel';
            }
            if (day.restaurants) {
              newDay.restaurants = day.restaurants.map(function(restaurant){
                restaurant.type = 'restaurants';
                var newItem = attractionsModule.create(restaurant);
                newItem.type = 'restaurants';
                return newItem;
              });
            }
            if (day.activities) {
              newDay.activities = day.activities.map(function(activity) {
                activity.type = 'activities';
                var newItem = attractionsModule.create(activity);
                newItem.type = 'activities';
                return newItem;
              });
            };

          });
          days[0].switchTo();
        } else {
          $(addDay(null));
        }
      });
    },

    addAttraction:   function (attraction){
      // adding to the day object
      var added = false;
      // console.log("BEFORE current day.restaurants: ",currentDay.restaurants, "attraction to add: ", attraction);
      switch (attraction.type) {
        case 'hotel':
          if (currentDay.hotel) currentDay.hotel.removeFromDay();
          currentDay.hotel = attraction;
          added = true;
          break;
        case 'restaurants':
          added = utilsModule.pushUnique(currentDay.restaurants, attraction); break;
        case 'activities':
          added = utilsModule.pushUnique(currentDay.activities, attraction); break;
        default: console.error('bad type:', attraction);
      }
      $.post('/api/days/' + currentDay.number + '/' + attraction.type + '/' + attraction._id, function(resData){ console.log(resData); });

      if ( added ) attraction.draw() ;
    },

    removeAttraction: function (attraction) {
      // removing from the day object
      switch (attraction.type) {
        case 'hotel':
          currentDay.hotel = null; break;
        case 'restaurants':
          utilsModule.remove(currentDay.restaurants, attraction); break;
        case 'activities':
          utilsModule.remove(currentDay.activities, attraction); break;
        default: console.error('bad type:', attraction);
      }
      $.ajax({
        method: 'DELETE',
        url: '/api/days/'+currentDay.number+'/'+attraction.type+'/'+attraction._id,
        success: function(data) {
          console.log(data.status);
        }
      })
      // deactivating UI
      attraction.hide();
    }

  };

  return methods;

}());
