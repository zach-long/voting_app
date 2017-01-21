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
  // define globals
  var optionsField = document.getElementsByClassName('options')[0];
  var loginForm = document.getElementById('login-form');
  var registerForm = document.getElementById('registration-form');
  var privateButton = document.getElementsByClassName('checkbox')['private']
  var publicButton = document.getElementsByClassName('checkbox')['public']

  // set event listener to add button functionality
  if (document.getElementById('add-option') !== null) {
    addOptionButton = document.getElementById('add-option');
    addOptionButton.addEventListener('click', addInput);
  };

  // set event listner for button to close a form
  if (document.getElementsByClassName('dismiss') !== null) {
    closeModal = document.getElementsByClassName('dismiss');
    Array.prototype.filter.call(closeModal, function(dismissButton) {
      dismissButton.addEventListener('click', function() {
        closeModalForm(this);
      });
    });
  };

  // set event listener to display login form
  if (document.getElementsByClassName('login') !== null) {
    loginButton = document.getElementsByClassName('login');
    Array.prototype.filter.call(loginButton, function(button) {
      button.addEventListener('click', function() {
        displayModalForm(loginForm, registerForm);
      });
    });
  };

  // set event listener to display registration form
  if (document.getElementById('register') !== null) {
    registerButton = document.getElementById('register');
    registerButton.addEventListener('click', function() {
      displayModalForm(registerForm, loginForm);
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

  /* opens a modal window and closes an already open one
     - 'windowToOpen' is the modal window being acted on
     - 'alternateWindow' is the other window which
        may or may not be open during the request */
  function displayModalForm(windowToOpen, alternateWindow) {
    // if another modal window is open, close it
    if (alternateWindow.classList.contains('fadeIn')) {
      alternateWindow.classList.remove('fadeIn');
      alternateWindow.classList.add('fadeOut');
    };
    // if this window is already open, close it
    if (windowToOpen.classList.contains('fadeIn')) {
      windowToOpen.classList.remove('fadeIn');
      windowToOpen.classList.add('fadeOut');
      return;
    };
    // open
    windowToOpen.classList.remove('fadeOut');
    windowToOpen.classList.add('fadeIn');
  };

  /* closes open form, login or register, respective to
     the button from which form was clicked
     - called from 'closeModal' event listener */
  function closeModalForm(clicked) {
    let modalForm = clicked.parentNode.parentNode;
    modalForm.classList.remove('fadeIn');
    modalForm.classList.add('fadeOut');
  };

  // unchecks a checkbox if one is already checked
  function syncronizeCheckboxes(clicked, pri, pub) {
    pri.checked = false;
    pub.checked = false;
    clicked.checked = true;
  };

}());
