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

'use strict';

describe('Controller: toastrController', function () {

  beforeEach(angular.mock.module('inspirehepSearch.suggestions'));
  beforeEach(angular.mock.module('templates'));
  beforeEach(angular.mock.module('invenioSearch'));

  var $compile;
  var $controller;
  var $httpBackend;
  var $rootScope;
  var ctrl;
  var scope;
  var template;

  beforeEach(inject(
    function (_$compile_, _$httpBackend_, _$rootScope_, _$controller_) {
      $compile = _$compile_;
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();


      template = '<inspire-search-suggestions template = "src/inspirehep-search-suggestions/templates/suggestions.html"></inspire-search-suggestions>';
      scope.vm = {}
      scope.vm.invenioSearchResults = {
        'warnings': [{
          "query_suggestion": "MalformedQuery"
        }]
      }
      ctrl = $controller('toastrController', {
        $scope: scope
      });
      template = $compile(template)(scope);
      scope.$digest();

    }));

  describe('Initial state', function () {
    it('should instantiate the controller properly', function () {
      expect(template.html()).to.contain('tooltip-class="suggestion_tooltip"');
    });
  });

});
