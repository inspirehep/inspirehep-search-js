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

describe('Unit: testing dependencies', function() {

  var module;
  var dependencies;
  dependencies = [];

  var hasModule = function(module) {
    return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function() {
    // Get module
    module = angular.module('inspirehepSearch');
    dependencies = module.requires;
  });

  it('should load filters module', function() {
    expect(hasModule('inspirehepSearch.filters')).to.be.ok;
  });

  it('should load configuration module', function() {
    expect(hasModule('inspirehepSearch.configuration')).to.be.ok;
  });

  it('should load angular-ui module', function() {
    expect(hasModule('ui.bootstrap')).to.be.ok;
  });

  it('should load suggestions module', function() {
    expect(hasModule('inspirehepSearch.suggestions')).to.be.ok;
  });
});
