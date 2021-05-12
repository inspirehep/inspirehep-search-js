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
/*jshint maxcomplexity:false */
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
