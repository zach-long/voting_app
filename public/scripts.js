'use strict'

(function() {

  // define variable placeholders
  var addOptionButton;
  // define globals
  var optionsField = document.getElementsByClassName('options')[0];

  // set event listener to add button functionality
  addOptionButton = document.getElementById('add-option');
  addOptionButton.addEventListener('click', addInput);

  /* adds another input field to poll creation
     - called from 'addOptionButton' event listener */
  function addInput() {
    let div = document.createElement('div');
    div.innerHTML = '<label>Option</label><input type="text" name="option">';
    optionsField.insertAdjacentElement('beforeend', div);
  };

}());
