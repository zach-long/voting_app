/* IIFE configures the page with listeners
   automatically on every page load */
(function() {
  'use strict';

  // define variable placeholders
  var addOptionButton;
  var loginButton;
  var registerButton;
  var closeModal;
  var checkboxes;
  var modalBackground;
  var authenticationForm;
  // define globals
  var optionsField = document.getElementsByClassName('options')[0];
  var privateButton = document.getElementsByClassName('checkbox')['private']
  var publicButton = document.getElementsByClassName('checkbox')['public']

  // set event listener to add button functionality
  if (document.getElementById('add-option') !== null) {
    addOptionButton = document.getElementById('add-option');
    addOptionButton.addEventListener('click', addInput);
  };

  // set event listner for button to close the modal form
  if (document.getElementsByClassName('dismiss') !== null) {
    closeModal = document.getElementsByClassName('dismiss');
    Array.prototype.filter.call(closeModal, function(dismissButton) {
      dismissButton.addEventListener('click', function() {
        closeModalForm();
      });
    });
  };

  // set listener so modal form closes if user clicks off
  if (modalBackground !== 'undefined') {
    modalBackground = document.getElementById('modal');
    authenticationForm = document.getElementById('authenticate');
    modalBackground.addEventListener('click', closeModalForm);
  };

  // set event listener to display login form
  if (document.getElementsByClassName('login') !== null) {
    loginButton = document.getElementsByClassName('login');
    Array.prototype.filter.call(loginButton, function(button) {
      button.addEventListener('click', displayModalForm);
    });
  };

  // set event listner for checkboxes
  if (document.getElementsByClassName('checkbox') !== null) {
    checkboxes = document.getElementsByClassName('checkbox');
    Array.prototype.filter.call(checkboxes, function(checkbox) {
      checkbox.addEventListener('click', function() {
        syncronizeCheckboxes(this, privateButton, publicButton);
      });
    });
  };

  /* adds another input field to poll creation
     - called from 'addOptionButton' event listener */
  function addInput() {
    let div = document.createElement('div');
    div.innerHTML = '<label>Option </label><input type="text" name="option">';
    optionsField.insertAdjacentElement('beforeend', div);
  };

  /* opens a modal window */
  function displayModalForm() {
    modalBackground.classList.remove('fadeOut');
    modalBackground.classList.add('fadeIn');
  };

  /* closes open form, login or register, respective to
     the button from which form was clicked
     - called from 'closeModal' event listener */
  function closeModalForm() {
    modalBackground.classList.remove('fadeIn');
    modalBackground.classList.add('fadeOut');
  };

  // unchecks a checkbox if one is already checked
  function syncronizeCheckboxes(clicked, pri, pub) {
    pri.checked = false;
    pub.checked = false;
    clicked.checked = true;
  };

}());
