/* IIFE configures the page with listeners
   automatically on every page load */
(function() {
  'use strict';

  // define variable placeholders
  var addOptionButton;
  var loginButton;
  var registerButton;
  var closeModal;
  // define globals
  var optionsField = document.getElementsByClassName('options')[0];
  var loginForm = document.getElementById('login-form');
  var registerForm = document.getElementById('registration-form');

  if (document.getElementById('add-option') !== null) {
    // set event listener to add button functionality
    addOptionButton = document.getElementById('add-option');
    addOptionButton.addEventListener('click', addInput);
  };

  // set event listner for button to close a form
  closeModal = document.getElementsByClassName('dismiss');
  Array.prototype.filter.call(closeModal, function(dismissButton) {
    dismissButton.addEventListener('click', closeModalForm);
  });

  // set event listener to display login form
  loginButton = document.getElementsByClassName('login');
  Array.prototype.filter.call(loginButton, function(button) {
    button.addEventListener('click', displayLoginForm);
  });

  // set event listener to display registration form
  registerButton = document.getElementById('register');
  registerButton.addEventListener('click', displayRegistrationForm);

  /* adds another input field to poll creation
     - called from 'addOptionButton' event listener */
  function addInput() {
    let div = document.createElement('div');
    div.innerHTML = '<label>Option </label><input type="text" name="option">';
    optionsField.insertAdjacentElement('beforeend', div);
  };

  /* displays the hidden login form
     - called from 'loginButton' event listener */
  function displayLoginForm() {
    loginForm.classList.add('visible');
  };

  /* displays the hidden registration form
     - called from 'registerButton' event listener */
  function displayRegistrationForm() {
    registerForm.classList.add('visible');
  };

  /* closes open form, login or register, respective to
     the button from which form was clicked
     - called from 'closeModal' event listener */
  function closeModalForm() {
    let modalForm = this.parentNode.parentNode;
    modalForm.classList.remove('visible');
  };

}());
