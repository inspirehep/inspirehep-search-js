(function (angular) {

  function MathjaxController($scope) {

    function requestMathjax() {
          setTimeout(function() {
             MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
          });
    }

    $scope.$on('invenio.search.success', requestMathjax);
  }

  MathjaxController.$inject = ['$scope'];

  angular.module('inspirehepMathjax.controllers', [])
    .controller('MathjaxController', MathjaxController);

})(angular);
