'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin', 
  function($scope, $filter, Admin) {

  $scope.labelsPieChart = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  $scope.pieData = [300, 500, 100];  
      
    $scope.labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre'];
  $scope.series = ['Series A', 'Series B'];

  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40, 70, 68],
    [28, 48, 40, 19, 86, 27, 90, 95, 92]
  ];
      
    (function(w, d, s, g, js, fs) {
      g = w.gapi || (w.gapi = {});
      g.analytics = {
        q: [],
        ready: function(f) {
          this.q.push(f);
        }
      };
      js = d.createElement(s);
      fs = d.getElementsByTagName(s)[0];
      js.src = 'https://apis.google.com/js/platform.js';
      fs.parentNode.insertBefore(js, fs);
      js.onload = function() {
        g.load('analytics');
      };
    }(window, document, 'script'));

    gapi.analytics.ready(function() {

      /**
       * Authorize the user immediately if the user has already granted access.
       * If no access has been created, render an authorize button inside the
       * element with the ID "embed-api-auth-container".
       */
      gapi.analytics.auth.authorize({
        container: 'embed-api-auth-container',
        clientid: '1052279473598-phulcego9iht7kr7l7lp4es8gkflb63v.apps.googleusercontent.com'
      });


      /**
       * Create a new ViewSelector instance to be rendered inside of an
       * element with the id "view-selector-container".
       */
      var viewSelector = new gapi.analytics.ViewSelector({
        container: 'view-selector-container'
      });

      // Render the view selector to the page.
      viewSelector.execute();

      /**
       * Create a table chart showing top browsers for users to interact with.
       * Clicking on a row in the table will update a second timeline chart with
       * data from the selected browser.
       */
      var mainChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:browser',
          'metrics': 'ga:sessions',
          'sort': '-ga:sessions',
          'max-results': '6'
        },
        chart: {
          type: 'TABLE',
          container: 'main-chart-container',
          options: {
            width: '100%'
          }
        }
      });


      /**
       * Create a timeline chart showing sessions over time for the browser the
       * user selected in the main chart.
       */
      var breakdownChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:date',
          'metrics': 'ga:sessions',
          'start-date': '7daysAgo',
          'end-date': 'yesterday'
        },
        chart: {
          type: 'LINE',
          container: 'breakdown-chart-container',
          options: {
            width: '100%'
          }
        }
      });


      /**
       * Store a refernce to the row click listener variable so it can be
       * removed later to prevent leaking memory when the chart instance is
       * replaced.
       */
      var mainChartRowClickListener;


      /**
       * Update both charts whenever the selected view changes.
       */
      viewSelector.on('change', function(ids) {
        var options = {
          query: {
            ids: ids
          }
        };

        // Clean up any event listeners registered on the main chart before
        // rendering a new one.
        if (mainChartRowClickListener) {
          google.visualization.events.removeListener(mainChartRowClickListener);
        }

        mainChart.set(options).execute();
        breakdownChart.set(options);

        // Only render the breakdown chart if a browser filter has been set.
        if (breakdownChart.get().query.filters) breakdownChart.execute();
      });


      /**
       * Each time the main chart is rendered, add an event listener to it so
       * that when the user clicks on a row, the line chart is updated with
       * the data from the browser in the clicked row.
       */
      mainChart.on('success', function(response) {

        var chart = response.chart;
        var dataTable = response.dataTable;

        // Store a reference to this listener so it can be cleaned up later.
        mainChartRowClickListener = google.visualization.events
          .addListener(chart, 'select', function(event) {

            // When you unselect a row, the "select" event still fires
            // but the selection is empty. Ignore that case.
            if (!chart.getSelection().length) return;

            var row = chart.getSelection()[0].row;
            var browser = dataTable.getValue(row, 0);
            var options = {
              query: {
                filters: 'ga:browser==' + browser
              },
              chart: {
                options: {
                  title: browser
                }
              }
            };

            breakdownChart.set(options).execute();
          });
      });

    });
      

    Admin.query(function(data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function() {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function() {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function() {
      $scope.figureOutItemsToDisplay();
    };
  }
                                                    
 
]);