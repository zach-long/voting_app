'use strict';

// import module
//import Chart from 'modules/Chart.min.js';

// define placeholders
var pollData;
var pollUrl;
var pollOptionNames;
var pollOptionVotes;
var backgroundColorGradientObject;
var borderColorGradientObject;

// create url for http request
let pageUrl = window.location.href;
let tempArray = pageUrl.split('/');
let pollID = tempArray.pop();
tempArray.push('json', pollID);
pollUrl = tempArray.join('/');

// http request to get poll data
// 'get()' defined in 'httpRequest.js'
//   - makes an http request as a promise
get(pollUrl).then(function(response) {
  // hide "loading"
  let loading = document.getElementById('loading');
  loading.classList.add('not-visible');
  // build chart
  pollData = JSON.parse(response);
  let pollChoices = getDataFromArray('choice', pollData);
  let pollChoiceVotes = getDataFromArray('votes', pollData);
  createChart(pollData.name, pollChoices, pollChoiceVotes);

}, function(error) {
  pollData = error;
});

// function to create a chart
function createChart(pollName, labelArray, dataArray) {
  // define context and create chart
  let c = document.getElementById('poll-result-visual');
  let context = c.getContext('2d');

  // generate array with a color for each poll option
  let arrayOfBackgroundColors = [];
  let arrayOfBorderColors = [];
  for (let i = 0; i < labelArray.length; i++) {
    let bgCol = generateColorRGBA(0.6);
    let borderCol = generateColorRGBA(1);
    arrayOfBackgroundColors.push(bgCol);
    arrayOfBorderColors.push(borderCol);
  };

  let pollResults = new Chart(context, {

    type: 'horizontalBar',

    data: {
      labels: labelArray,
      datasets: [{
        label: pollName,
        backgroundColor: arrayOfBackgroundColors,
        borderColor: arrayOfBorderColors,
        borderWidth: 2,
        data: dataArray
      }]
    },

    options: {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      }
    }

  });
};

// consolidates data from an array inside an object
// returns a smaller array
function getDataFromArray(stringAttributeToParse, pollObject) {
  let optionArray = [];
  pollObject.options.forEach(function(option) {
    optionArray.push(option[stringAttributeToParse]);
  });
  return optionArray;
};

// returns a random color with transparency
function generateColorRGBA(opacity) {
  let rgba = 'rgba(' + generateColorValue() + ', ' + generateColorValue() + ', ' + generateColorValue() + ', ' + opacity + ')';
  return rgba;
};

// returns a random 0-255 number
function generateColorValue() {
  let num = Math.floor(Math.random() * 255);
  return num;
}
