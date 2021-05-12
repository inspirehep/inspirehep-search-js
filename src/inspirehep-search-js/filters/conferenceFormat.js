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
