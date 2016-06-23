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

describe('Controller: FacetsShowMoreController', function () {

  beforeEach(angular.mock.module('inspirehepFacetsShowMore'));
  // load the templates
  beforeEach(angular.mock.module('templates'));
  // load invenioSearch module
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
      scope = $rootScope;

      ctrl = $controller('FacetsShowMoreController', {
        $scope: scope
      });

      // Expect a request
      $httpBackend.whenGET('/api?page=1&size=20').respond(200, {success: true});

      template = '<invenio-search search-endpoint="/api"></invenio-search>';

      template = $compile(template)(scope);
      scope.$digest();

      scope.vm.invenioSearchResults = {
        "aggregations": {
          "author": {
            "buckets": [
              {
                "doc_count": 47,
                "key": "Bocci, Andrea"
              },
              {
                "doc_count": 40,
                "key": "Meier, Frank"
              },
              {
                "doc_count": 47,
                "key": "Bocci, Andrea"
              },
              {
                "doc_count": 40,
                "key": "Meier, Frank"
              },
              {
                "doc_count": 47,
                "key": "Bocci, Andrea"
              },
              {
                "doc_count": 40,
                "key": "Meier, Frank"
              },
              {
                "doc_count": 47,
                "key": "Bocci, Andrea"
              },
              {
                "doc_count": 40,
                "key": "Meier, Frank"
              },
              {
                "doc_count": 47,
                "key": "Bocci, Andrea"
              },
              {
                "doc_count": 40,
                "key": "Meier, Frank"
              },
              {
                "doc_count": 47,
                "key": "Bocci, Andrea"
              },
              {
                "doc_count": 40,
                "key": "Meier, Frank"
              }
            ]
          }
        }
      };

      scope.$digest();
    })
  );

  describe('Initial state', function () {
    it('should instantiate the controller properly', function () {
      expect(ctrl).to.not.be.undefined;
    });
  });

  describe('Show more functionality', function () {
    it('should reset show more on search success', function () {
      var originalFacetResults = scope.facetResults;

      // Change the number of results shown in a facet
      scope.facetResults = 50;

      scope.vm.invenioDoSearch();
      $httpBackend.flush();

      // Make sure the value has been reseted after the search
      expect(scope.facetResults).to.be.equal(originalFacetResults);
    });

    it('should increase the number of results', function () {

      var originalFacetResults = scope.facetResults;

      scope.moreFacetResults();

      expect(scope.facetResults).to.be.equal(originalFacetResults + scope.step);
    });

    it('should calculate step', function () {


      expect(scope.calculateStep('author')).to.be.equal(2);

      // Double the number of buckets
      Array.prototype.push.apply(
        scope.vm.invenioSearchResults.aggregations.author.buckets,
        scope.vm.invenioSearchResults.aggregations.author.buckets
      );

      expect(scope.calculateStep('author')).to.be.equal(scope.step);

    });

  });




});
