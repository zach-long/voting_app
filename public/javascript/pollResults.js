'use strict';

// import module
//import Chart from 'modules/Chart.min.js';

// define context and create chart
let context = document.getElementById('poll-result-visual').getContext('2d');
let pollResults = new Chart(context, {

  type: 'horizontalBar',

  data: {
    labels: ['label one', 'label two', 'label three'],
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
        data: [3, 5, 1]
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
