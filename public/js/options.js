'use strict';
/* global $ daysModule attractionsModule hotels restaurants activities */

$(function(){

  var $optionsPanel = $('#options-panel');

  // remember, second param of `forEach` is a `this` binding
  hotels.forEach(makeOption, $optionsPanel.find('#hotel-choices'));
  restaurants.forEach(makeOption, $optionsPanel.find('#restaurant-choices'));
  activities.forEach(makeOption, $optionsPanel.find('#activity-choices'));

  function makeOption (dbAttraction) {
    dbAttraction.type = this.data('type');
    var attraction = attractionsModule.create(dbAttraction);
    var $option = $('<option></option>')
      .text(attraction.name)
      .data(attraction);
    this.append($option);
  }

  $optionsPanel.on('click', 'button[data-action="add"]', addAttraction);

  function addAttraction () {
    var $button = $(this);
    var attraction = $button.siblings('select').find(':selected').data();
    daysModule.addAttraction(attractionsModule.create(attraction)); // model
  }

});
