(function (angular) {

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

(function (angular) {
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
    $provide.decorator('invenioSearchAPI', ['$delegate', function ($delegate) {
      // Save the default function
      var searchFn = $delegate.search;
      $delegate.search = function (args) {
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
    'ui.bootstrap',
    'authors',
    'inspirehepSearch.suggestions'
  ]);

})(angular);

(function(angular) {

  angular.module('authors', [
    'ui.bootstrap',
    'authors.directives',
    'authors.controllers'
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

(function (angular) {

  // Setup module
  angular.module('inspirehepSearch.filters', [
    'ngSanitize', // Allows displaying non-escaped-HTML in filters
    'inspirehepSearch.filters.abstract',
    'inspirehepSearch.filters.authorInstitution',
    'inspirehepSearch.filters.arxiv',
    'inspirehepSearch.filters.arxivInfo',
    'inspirehepSearch.filters.capitalize',
    'inspirehepSearch.filters.collaboration',
    'inspirehepSearch.filters.corporateAuthor',
    'inspirehepSearch.filters.date',
    'inspirehepSearch.filters.datePassedNow',
    'inspirehepSearch.filters.doi',
    'inspirehepSearch.filters.publicationInfo',
    'inspirehepSearch.filters.publicationInfoDoi',
    'inspirehepSearch.filters.reportNumber',
    'inspirehepSearch.filters.title'
  ]);

})(angular);

(function (angular) {

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
      if (resultsLeft < $scope.step) {
        return resultsLeft;
      } else {
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

(function (angular) {
  angular.module('inspirehepSearch.suggestions', [])
    .controller('toastrController', function ($scope) {
      for (var i = 0; i < $scope.vm.invenioSearchResults.warnings.length; i++) {
        if ($scope.vm.invenioSearchResults.warnings[i].hasOwnProperty('query_suggestion')) {
          $scope.suggestion_message = $scope.vm.invenioSearchResults.warnings[i].query_suggestion;
          break;
        }
      }
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

  function authorCtrl($scope) {
    var vm = this; 
      
    vm.getAuthors = getAuthors;
    vm.splitAuthorName = splitAuthorName;
    vm.renderAuthorNames = renderAuthorNames;

    function getAuthors() {
      var authors_list = [];
      if (vm.authors !== undefined) {
        for (var i=0; i<vm.authors.length; i++) {
          if (vm.authors[i].full_name) {
            authors_list.push(renderAuthorNames(vm.authors[i]));
          }
        } 
        return authors_list;
      }
    }

    function splitAuthorName(authorName) {
      var new_name = authorName.split(',');
      var reversed = new_name.reverse();
      return reversed.join(' ');
    }

    function renderAuthorNames(author) {
      var obj_author = {};
      obj_author.full_name = author.full_name;
      if (author.affiliations !== undefined && author.affiliations.length > 0) {
          obj_author.affiliation = author.affiliations[0].value;
      }
      return obj_author;
    }

  }

  authorCtrl.$inject = ['$scope'];

  angular.module('authors.controllers', [])
    .controller('authorCtrl', authorCtrl);

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

  function authorsAffiliation() {

    function link(scope, element, attrs, vm) {

      if (attrs.authors !== '') {
        vm.authors = JSON.parse(attrs.authors);
      }

      if (attrs.collaboration !== '') {
        vm.collaboration = JSON.parse(attrs.collaboration);
      }

      vm.numberOfAuthors = parseInt(attrs.numberOfAuthors);

      vm.controlNumber = parseInt(attrs.controlNumber);

      vm.AUTHORS_LIMIT = 10;

      vm.authorsInfo = vm.getAuthors();

    }

    function templateUrl(element, attrs) {
      return attrs.authorsTemplate;
    }

    return {
        templateUrl: templateUrl,
        restrict: 'E',
        controller: 'authorCtrl',
        controllerAs: 'vm',
        scope: true,
        link: link
      };
  }


  angular.module('authors.directives', [])
    .directive('authorsAffiliation', authorsAffiliation);

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
* In applying this license, CERN does not
* waive the privileges and immunities granted to it by virtue of its status
* as an Intergovernmental Organization or submit itself to any jurisdiction.
*/

(function(angular) {

  function abstractFilter() {
    return function(input) {
      if (input === undefined) {
        return;
      }
      
      var tagsToReplace = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;'
      };
      
      function replaceTag(tag) {
        return tagsToReplace[tag] || tag;
      }

      var abstract = '';
      for (var i=0; i < input.length; i++) {
        if (input[i].source !== 'arXiv' && input[i].value !== undefined) {
          abstract = input[i].value;
        } else {
          if (input[i].value !== undefined) {
            abstract = input[i].value;
          }
        }
      }
      return abstract.replace(/[&<>]/g, replaceTag);
    };
  }
  angular.module('inspirehepSearch.filters.abstract', [])
    .filter('abstract', abstractFilter);
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
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
*/

(function(angular) {
  
  function arxivFilter() {
    return function(input) {
      if ( input === undefined ) {
        return;
      }

      var eprint = '';
      for (var i=0; i < input.length; i++) {
        eprint = input[i].value;
        break;
      }

      return eprint;
    };
  }
  angular.module('inspirehepSearch.filters.arxiv', [])
    .filter('arxiv', arxivFilter);

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
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
*/

(function(angular) {
  
  function arxivInfoFilter() {
    return function(input) {
      if ( input === undefined ) {
        return;
      }
      var eprint = '';
      var categories = '';
      for (var i=0; i < input.length; i++) {
          eprint = 'e-Print: <a href="http://arxiv.org/abs/' + 
              input[i].value + '" >' + input[i].value + '</a>';
          if (input[i].categories) {
            categories = '[' +  input[i].categories[0] + ']';
          }
      }
      return eprint + ' ' + categories;
    };
  }
  angular.module('inspirehepSearch.filters.arxivInfo', [])
    .filter('arxivInfo', arxivInfoFilter);

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
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
*/

(function(angular) {

  function authorInstitutionFilter() {
    return function(input) {
      if ( input === undefined ) {
        return;
      }

      var first_institution  = '';
      for ( var i=0; i<input.length; i++ ) {
        if ( typeof input[i].institution !== 'undefined' && typeof input[i].institution.name !== 'undefined') {
          if ( typeof input[i].status !== 'undefined' && input[i].status.toLowerCase() === 'current' ) {
            return '(' + input[i].institution.name + ')';
          }
          else if ( !first_institution ) {
            first_institution = input[i].institution.name;
          }
        }
      }
      if ( first_institution ) {
          return '(' + first_institution + ')';
      }
    };
  }

  angular.module('inspirehepSearch.filters.authorInstitution', [])
    .filter('authorInstitution', authorInstitutionFilter);

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

(function (angular) {

  function capitalizeFilter() {
    return function (token) {
      if (!token) {
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
* In applying this license, CERN does not
* waive the privileges and immunities granted to it by virtue of its status
* as an Intergovernmental Organization or submit itself to any jurisdiction.
*/

(function(angular) {
  
  function collaborationFilter() {
    return function(collaboration, corporate_author) {
      if ( collaboration === undefined ) {
        return;
      }
      
      var col = [];
      var result = '';
      if (!corporate_author) {
        for (var i=0; i < collaboration.length; i++) {
          if (collaboration[i].value) {
            col.push('<a href="/search?p=collaboration:' + collaboration[i].value + 
              '">' + collaboration[i].value + '</a>');
          }
        }
      }

      if (col.length !== 0) {
        result = col.join(' and ') + (col.length > 1 ? ' Collaborations' : ' Collaboration');
      }

      return result;
      
    };
  }
  angular.module('inspirehepSearch.filters.collaboration', [])
    .filter('collaboration', collaborationFilter);

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
  
  function corporateAuthorFilter() {
    return function(input, corporate_author) {
      if ( input === undefined ) {
        if (corporate_author) {
          return corporate_author[0];
        } 
        return;
      }
    };
  }

  angular.module('inspirehepSearch.filters.corporateAuthor', [])
    .filter('corporateAuthor', corporateAuthorFilter);

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
  
  function dateFilter() {
    return function(date, authors, collaboration, corporate_author) {
      if ( authors === undefined &&  collaboration === undefined && corporate_author === undefined) {
        return date;
      } else {
        return '- ' + date;
      }
    };
  }

  angular.module('inspirehepSearch.filters.date', [])
    .filter('date', dateFilter);

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

(function (angular) {

    function datePassedNowFilter() {
        return function (token) {
            var current_date = new Date();
            var date = new Date(token);
            return date >= current_date;
        };
    }

    angular.module('inspirehepSearch.filters.datePassedNow', [])
        .filter('datePassedNow', datePassedNowFilter);

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
      
      var dois = [];
      for (var i=0; i < input.length; i++) {
        if (input[i].value) {
          dois.push('<a href="http://dx.doi.org/' + input[i].value + '" title="DOI" >' + input[i].value + '</a>');
        }
      }

      if (dois.length !== 0) {
        return 'DOI: ' + dois.join(', ');
      } else {
        return '';
      }
    };
  }

  angular.module('inspirehepSearch.filters.doi', [])
        .filter('doi', doiFilter);

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
  
  function publicationInfoFilter() {
    return function(input) {
      if (input === undefined) {
        return;
      }

      var pub_info = '';
      if (input['pub_info']) {
        pub_info = 'Published in ' + input['pub_info'].join(' and ');
        
      }
      if (input['conf_info']) {
        pub_info += ' ' + input['conf_info'];
      }

      return pub_info;
    };
  }

  angular.module('inspirehepSearch.filters.publicationInfo', [])
    .filter('publicationInfo', publicationInfoFilter);

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
  
  function publicationInfoDoiFilter() {
    return function(input, pub_info) {
      if (input === undefined) {
        return;
      }

      var pub_info_and_doi = 'Published in ';
      pub_info_and_doi += '<a href="http://dx.doi.org/' + input[0].value + '" title="DOI">'  +
          '<span class="text-left">' + pub_info['pub_info'][0] + '</span>' + '</a>';

      if (pub_info['conf_info']) {
        pub_info_and_doi += ' ' + pub_info['conf_info'];
      }
      
      return pub_info_and_doi;
    };
  }

  angular.module('inspirehepSearch.filters.publicationInfoDoi', [])
    .filter('publicationInfoDoi', publicationInfoDoiFilter);

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
* In applying this license, CERN does not
* waive the privileges and immunities granted to it by virtue of its status
* as an Intergovernmental Organization or submit itself to any jurisdiction.
*/

(function(angular) {
  
  function reportNumberFilter() {
    return function(input) {
      if (input === undefined) {
        return;
      }
      var reportNumbers = [];
      for (var i=0; i < input.length; i++) {
        if (input[i].value) {
          reportNumbers.push(' ' + input[i].value);
        }
      } 

      if (reportNumbers.length !== 0) {
        return 'Report number: ' + reportNumbers;
      } else {
        return '';
      }
    };
  }
  
  angular.module('inspirehepSearch.filters.reportNumber', [])
    .filter('reportNumber', reportNumberFilter);

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
* In applying this license, CERN does not
* waive the privileges and immunities granted to it by virtue of its status
* as an Intergovernmental Organization or submit itself to any jurisdiction.
*/

(function(angular) {

  function titleFilter() {
    return function(input) {
      if (input === undefined) {
        return;
      }

      var title = '';
      if (input['title'] !== undefined) {
        title = input['title'];
        if (input['subtitle'] !== undefined) {
          title += ' : ' + input['subtitle'];
        }
      }
      return title;
    };
  }
  angular.module('inspirehepSearch.filters.title', [])
    .filter('title', titleFilter);
})(angular);