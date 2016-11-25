(function(angular) {

  angular.module('claimMode', [
    'claimMode.controllers'
  ]);


})(angular);

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

  // Setup everything
  angular.module('inspirehepSearch', [
    'invenioSearch',
    'inspirehepFacetsShowMore',
    'inspirehepSearch.filters',
    'ui.bootstrap',
    'authors',
    'claimMode'
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
    'inspirehepSearch.filters.conferenceFormat',
    'inspirehepSearch.filters.journalFormat',
    'inspirehepSearch.filters.reportNumber',
    'inspirehepSearch.filters.title'
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

  function claimCtrl($scope, $http, $window) {


    // Flag that determines if the user is in claim mode or not.
    $scope.vm.ClaimToggled = false;

    // Flag for the switch element.
    $scope.vm.SwitchColor = false;

    // Flag that determines if a user is logged
    $scope.user_is_logged = false;

    // Controller Methods
    $scope.toggleClaim = toggleClaim;
    $scope.vm.claimRecord = claimRecord;
    $scope.vm.alreadyClaimed = alreadyClaimed;
    $scope.vm.isClaimable = isClaimable;

    // Set the ClaimToggled and SwitchColor flags based on the url argument `claim`.
    if ($scope.vm.invenioSearchArgs.claim === "true"){
      $scope.vm.SwitchColor = true;
      $scope.vm.ClaimToggled = true;
    }

    //  Getting the current_user
    $http.get('/current_user').then(function (response) {

      if (response.data.status === 'found') {
        $scope.user_is_logged = true;
        $scope.user_full_name = response.data.full_name;
        $scope.user_orcid_id = response.data.orcid_id;
      }

      // Search for already claimed records from this author.
      $http({
        url: '/search/claimedRecords',
        method: 'GET',
        params: {
          full_name: $scope.user_full_name,
          orcid_id: $scope.user_orcid_id
        }
      }).then(function (response) {
        $scope.vm.claimedRecords = response.data.records;
      });

      // Gets the records that are auto-claimable for this author.
      $http({
        url: '/search/claimableRecords',
        method: 'GET',
        params: {
          full_name: $scope.user_full_name,
          orcid_id: $scope.user_orcid_id
        }
      }).then(function (response) {
        $scope.vm.claimableRecords = response.data.records;
      });
    });


    function toggleClaim() {
    /**
     * Switch-Toggle function.
     */
      if ($scope.vm.ClaimToggled === false) {
        $scope.vm.SwitchColor = true;
        window.location.href = '/search?page=1&size=25&claim=true&cc=literature&q=author: "' + $scope.user_full_name + '"';
      } else {
        $scope.vm.SwitchColor = false;
        $window.location.href = '/search?claim=false';
      }

    }


    function claimRecord(recordId) {
      /**
     * Claims the record in behalf of the logged-in author.
     */
      console.log('Claiming ' + recordId);
      var body = {
            recordId: recordId,
            orcid_id: $scope.user_orcid_id
            phonetic_block:
      };

      $http.post('/search/claimRecord', body).then(function (response) {});
    }


    function alreadyClaimed(recordId) {
      if (!$scope.vm.claimedRecords) {
        return false;
      }

      if ($scope.vm.claimedRecords.indexOf(recordId) >= 0) {
        return true;
      }

      return false;
    }

    function isClaimable(recordId) {
      if (!$scope.vm.claimableRecords) {
        return false;
      }

      if ($scope.vm.claimableRecords.indexOf(String(recordId)) >= 0) {
        return true;
      }

      return false;
    }

  }

  claimCtrl.$inject = ['$scope', '$http', '$window'];

  angular.module('claimMode.controllers', [])
    .controller('claimCtrl', claimCtrl);

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

  function conferenceFormatFilter() {
    return function(input, with_pub_info) {
      if (input === undefined) {
        return;
      }

      var output = '';

      if (input['conference_recid'] && input['parent_recid']) {
        if ( with_pub_info ) {
          output += ' (<a href="/record/' + input['parent_recid'] +
                    '">Proceedings</a> of <a href="/record/' +
                    input['conference_recid'] + '">' +
                    input['conference_title'] + '</a>)';
        }
        else {
          output += 'Published in <a href="/record/' + input['parent_recid'] +
                    '">proceedings</a> of <a href="/record/' +
                    input['conference_recid'] + '">' +
                    input['conference_title'] + '</a>';
          if (input['page_start'] && input['page_end']) {
            output += ', pages ' + input['page_start'] + '-' + input['page_end'];
          }
        }
      }

      else if (input['conference_recid'] && !input['parent_recid']) {
        if ( with_pub_info ) {
          output += '<br>';
        }
        output += 'Contribution to <a href="/record/' + input['conference_recid'] +
                  '">' + input['conference_title'] + '</a>';
      }

      else if (!input['conference_recid'] && input['parent_recid']) {
        if ( with_pub_info ) {
           output += ' (<a href="/record/' + input['parent_recid'] +
                     '">Proceedings</a> of ' + input['parent_title'] + ')';
        }
        else {
          output += 'Published in <a href="/record/' + input['parent_recid'] +
                    '">proceedings</a> of ' + input['parent_title'];
        }
      }

      return output;
    };
  }

  angular.module('inspirehepSearch.filters.conferenceFormat', [])
    .filter('conferenceFormat', conferenceFormatFilter);

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

  function journalFormatFilter() {
    return function(input) {
      if (input === undefined) {
        return;
      }

      var output = '';

      if (input['journal_title']) {
        output += '<i>' + input['journal_title'] + '</i> ';

        if (input['journal_volume']) {
          output += input['journal_volume'];
        }
        if (input['year']) {
          output += ' ' + '(' + input['year'] + ')';
        }
        if (input['journal_issue']) {
          output += ' ' + input['journal_issue'] + ',';
        }
        if (input['page_start'] && input['page_end']) {
          output += ' ' + input['page_start'] + '-' + input['page_end'];
        }
        else if (input['page_start']) {
          output += ' ' + input['page_start'];
        }
        else if (input['artid']) {
          output += ' ' + input['artid'];
        }
      }
      else if (input['pubinfo_freetext']) {
        output += input['pubinfo_freetext'];
      }

      return output;
    };
  }

  angular.module('inspirehepSearch.filters.journalFormat', [])
    .filter('journalFormat', journalFormatFilter);

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

  function publicationInfoFilter(conferenceFormatFilter, journalFormatFilter) {
    return function(input, conference_info) {
      if (input === undefined) {
        return;
      }

      var pub_info = '';
      var formatted_journals = [];
      var i, len;
      for (i = 0, len = input.length; i < len; i++) {
        if (input[i]['journal_title']) {
          formatted_journals.push(journalFormatFilter(input[i]));
        }
      }

      if (formatted_journals) {
          pub_info = formatted_journals.join(' and ');
      }

      var formatted_conference = '';
      if (conference_info) {
        for (i = 0, len = conference_info.length; i < len; i++) {
          formatted_conference = conferenceFormatFilter(
            conference_info[i],
            formatted_journals.length
          );
          if (formatted_conference) {
              pub_info += ' ' + formatted_conference;
          }
        }
      }

      if (pub_info && formatted_journals.length) {
        return 'Published in ' + pub_info;
      }
      else {
        return pub_info;
      }
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

  function publicationInfoDoiFilter(conferenceFormatFilter, journalFormatFilter) {
    return function(input, pub_info, conference_info) {
      if (input === undefined) {
        return;
      }

      var pub_info_and_doi = 'Published in ';
      pub_info_and_doi += '<a href="http://dx.doi.org/' + input[0].value + '" title="DOI">'  +
          '<span class="text-left">' + journalFormatFilter(pub_info[0]) + '</span>' + '</a>';

      if (conference_info) {
        var formatted_conference = '';
        var i, len;
        for (i = 0, len = conference_info.length; i < len; i++) {
          formatted_conference = conferenceFormatFilter(conference_info[i], true);
          if (formatted_conference) {
            pub_info_and_doi += formatted_conference;
            break;
          }
        }
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