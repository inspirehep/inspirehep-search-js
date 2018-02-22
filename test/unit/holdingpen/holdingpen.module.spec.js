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

describe('Unit: testing holdingpen dependencies', function() {

  var module;
  var dependencies;
  dependencies = [];

  var hasModule = function(module) {
    return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function() {
    // Get module
    module = angular.module('inspirehepHoldingpen');
    dependencies = module.requires;
  });

  it('should load xeditable module', function() {
    expect(hasModule('xeditable')).to.be.ok;
  });

  it('should load ui bootstrap module', function() {
    expect(hasModule('ui.bootstrap')).to.be.ok;
  });

  it('should load fps.hotkeys module', function() {
    expect(hasModule('fps.hotkeys')).to.be.ok;
  });

  it('should load ngSanitize module', function() {
    expect(hasModule('ngSanitize')).to.be.ok;
  });

  it('should load controllers module', function() {
    expect(hasModule('holdingpen.controllers')).to.be.ok;
  });

  it('should load services module', function() {
    expect(hasModule('holdingpen.services')).to.be.ok;
  });

  it('should load directives module', function() {
    expect(hasModule('holdingpen.directives')).to.be.ok;
  });

  it('should load angular.filter module', function() {
    expect(hasModule('angular.filter')).to.be.ok;
  });

  it('should load holdingpen.filters module', function() {
    expect(hasModule('holdingpen.filters')).to.be.ok;
  });

});
