'use strict';

// import module
//import Chart from 'modules/Chart.min.js';

// define placeholders
var pollData;
var pollUrl;
var pollOptionNames;
var pollOptionVotes;

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
  pollData = JSON.parse(response);
  let pollChoices = getDataFromArray('choice', pollData);
  let pollChoiceVotes = getDataFromArray('votes', pollData);
  createChart(pollChoices, pollChoiceVotes);
  
}, function(error) {
  pollData = error;
});

// function to create a chart
function createChart(labelArray, dataArray) {
  // define context and create chart
  let context = document.getElementById('poll-result-visual').getContext('2d');
  let pollResults = new Chart(context, {

    type: 'horizontalBar',

    data: {
      labels: labelArray,
      datasets: [
        {
          label: 'test dataset',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1,
          data: dataArray
        }
      ]
    },

    options: {
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
