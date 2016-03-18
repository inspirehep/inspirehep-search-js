(function(angular) {

  angular.module('inspirehepFacetsShowMore', [
    'inspirehepFacetsShowMore.controllers'
  ]);

})(angular);
/*
 * This file is part of INSPIRE.
 * Copyright (C) 2016 CERN.
 *
 * INSPIRE is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * INSPIRE is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with INSPIRE; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */

(function(angular) {
  // Configuration

  /**
   * @ngdoc interface
   * @name inspireSearchConfiguration
   * @namespace inspireSearchConfiguration
   * @param {service} $provide - Register components with the $injector.
   * @description
   *     Configuration of inspireSearch
   */
  function inspireSearchConfiguration($provide) {
    $provide.decorator('invenioSearchAPI', ['$delegate', function($delegate) {
      // Save the default function
      var searchFn = $delegate.search;
      $delegate.search = function(args) {
        /*
         * Args Object look like:
         *
         *   {
         *      url: ....
         *      method: ....
         *      params: ....
         *   }
         *
         */
        args['headers'] = {
            'Accept': 'application/vnd+inspire.brief+json'
          };
          // Call the original function with the enhanced parameters
        return searchFn(args);
      };
      return $delegate;
    }]);
  }

  // Inject the necessary angular services
  inspireSearchConfiguration.$inject = ['$provide'];

  // Setup configuration
  angular.module('inspirehepSearch.configuration', [])
    .config(inspireSearchConfiguration);

  // Setup everything
  angular.module('inspirehepSearch', [
    'invenioSearch',
    'inspirehepFacetsShowMore',
    'inspirehepSearch.filters',
    'inspirehepSearch.configuration',
    'inspirehepSearch.suggestions',
  ]);

})(angular);

/*
 * This file is part of INSPIRE.
 * Copyright (C) 2016 CERN.
 *
 * INSPIRE is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * INSPIRE is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with INSPIRE; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */

(function(angular) {

  // Setup module
  angular.module('inspirehepSearch.filters', [
    'ngSanitize', // Allows displaying non-escaped-HTML in filters 
    'inspirehepSearch.filters.capitalize',
    'inspirehepSearch.filters.doi',
  ]);


})(angular);
(function(angular) {

  function FacetsShowMoreController($scope) {

    $scope.facetResults = 10;

    $scope.step = 10;

    $scope.calculateStep = calculateStep;

    $scope.moreFacetResults = moreFacetResults;

    function moreFacetResults() {
      $scope.facetResults = $scope.facetResults + $scope.step;
    }

    function calculateStep(key) {
      var resultsLeft = $scope.vm.invenioSearchResults.aggregations[key].buckets.length - $scope.facetResults;
      if ( resultsLeft < $scope.step ) {
        return resultsLeft;
      }
      else {
        return $scope.step;
      }
    }

    function resetShowMore() {
      $scope.facetResults = 10;
    }

    $scope.$on('invenio.search.success', resetShowMore);
  }

  FacetsShowMoreController.$inject = ['$scope'];

  angular.module('inspirehepFacetsShowMore.controllers', [])
    .controller('FacetsShowMoreController', FacetsShowMoreController);

})(angular);
/*
 * This file is part of INSPIRE.
 * Copyright (C) 2016 CERN.
 *
 * INSPIRE is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * INSPIRE is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with INSPIRE; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */


(function(angular) {
  angular.module('inspirehepSearch.suggestions', ['toaster', 'ngAnimate']) //renive anim?
    .controller('toastrController', function($scope, toaster) {
      toaster.pop('warning', 'Warning:', $scope.vm.invenioSearchResults.suggestion_messages[0][1]);

      function clearToasts() {
        toaster.clear();
      }

      $scope.$on('invenio.search.success', clearToasts);

    });
})(angular);

/*
 * This file is part of INSPIRE.
 * Copyright (C) 2016 CERN.
 *
 * INSPIRE is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * INSPIRE is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with INSPIRE; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */

(function(angular) {

  function inspireSearchSuggestions() {

    function templateUrl(element, attrs) {
      return attrs.template;
    }
    return {
      restrict: 'E',
      scope: false,
      templateUrl: templateUrl,
    };
  }

  angular.module('inspirehepSearch.suggestions')
    .directive('inspireSearchSuggestions', inspireSearchSuggestions);

})(angular);

/*
 * This file is part of INSPIRE.
 * Copyright (C) 2016 CERN.
 *
 * INSPIRE is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * INSPIRE is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with INSPIRE; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */

(function(angular) {

  function capitalizeFilter() {
    return function(token) {
      if ( !token ) {
        return '';
      }
      return token.charAt(0).toUpperCase() + token.slice(1);
    };
  }

  angular.module('inspirehepSearch.filters.capitalize', [])
    .filter('capitalize', capitalizeFilter);

})(angular);

/*
 * This file is part of INSPIRE.
 * Copyright (C) 2016 CERN.
 *
 * INSPIRE is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * INSPIRE is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with INSPIRE; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */

(function(angular) {
  
  function doiFilter() {
    return function(input) {
      if ( input === undefined ) {
        return;
      }
      for (var i=0; i < input.length; i++) {
        if (input[i].value) {
          return '<a href="http://dx.doi.org/' + input[i].value + '" title="DOI" >' + input[i].value + '</a>';
        }
      }
    };
  }

  angular.module('inspirehepSearch.filters.doi', [])
    .filter('doi', doiFilter);

})(angular);
