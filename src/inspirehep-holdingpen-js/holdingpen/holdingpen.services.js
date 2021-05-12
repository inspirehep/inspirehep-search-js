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
  /**
   * HoldingPenRecordService allows for the getting, update and resolution of
   * workflow records.
   */
  angular.module('holdingpen.services', [])
    .factory('HoldingPenRecordService', ['$http',
        function ($http) {

          return {

            getRecord: function (vm, workflowId) {
              var service = this;
              $http({
                  url: '/api/holdingpen/' + workflowId,
                  method: 'GET',
                  headers: {
                      'Cache-Control': 'no-cache, no-store, must-revalidate',
                      'Pragma': 'no-cache',
                      'Expires': 0
                  }}).then(function (response) {
                      vm.record = response.data;
                      if (vm.record._workflow.data_type === 'authors') {
                      $('#breadcrumb').html(vm.record.metadata.name.value);
                      } else {
                      var title;
                      if (service.hasCrawlErrors(vm.record)) {
                          title = vm.record._extra_data.crawl_errors.file_name;
                    } else {
                      title = vm.record.metadata.titles[0].title;
                    }
                    $('#breadcrumb').html(title > 70 ? title.substring(0, 70) + '...' : title);
                  }
                }).catch(function (value) {
                  vm.ingestion_complete = false;
                  console.error(value);
                });
            },

            updateRecord: function (vm, workflowId) {
              return $http.post('/api/holdingpen/' + workflowId + '/action/edit', vm.record).then(function (response) {
                vm.saved = true;
                vm.update_ready = false;
              }).catch(function (value) {
                vm.saved = false;
                vm.update_ready = true;
                console.error('Sorry, an error occurred when saving. Please try again.');
              });
            },

            setDecision: function (vm, workflowId, decision) {

              var data = JSON.stringify({
                'value': decision,
                'pdf_upload': vm.pdf_upload,
                'reason': vm.reason
              });

              $http.post('/api/holdingpen/' + workflowId + '/action/resolve', data).then(function (response) {
                vm.ingestion_complete = true;
                var record = vm.record;
                if (!record) {
                  record = vm;
                }

                if(!record._extra_data) {
                  record._extra_data = {};
                }

                record._extra_data.user_action = decision;
                record._extra_data._action = null;

              }).catch(function (value) {
                vm.error = value;
              });
            },

            setCore: function(vm, workflowId) {
              $http.post('/api/holdingpen/' + workflowId + '/core-selection/continue').then(function (response) {
                vm.ingestion_complete = true;
                var record = vm.record;
                if (!record) {
                  record = vm;
                }

                if(!record._extra_data) {
                  record._extra_data = {};
                }

              }).catch(function (value) {
                vm.error = value;
              });
            },

            setAccept: function(vm, workflowId) {
              $http.post('/api/holdingpen/' + workflowId + '/core-selection/complete').then(function (response) {
                vm.ingestion_complete = true;
                var record = vm.record;
                if (!record) {
                  record = vm;
                }

                if(!record._extra_data) {
                  record._extra_data = {};
                }

              }).catch(function (value) {
                vm.error = value;
              });
            },

            setMatchDecision: function(workflowId, match) {
              return $http.post('/api/holdingpen/' + workflowId + '/action/resolve', {match_recid: match});
            },

            setBatchDecision: function (records, selected_record_ids, decision) {

              for (var record_idx in selected_record_ids) {

                var _id = selected_record_ids[record_idx];
                var _data = JSON.stringify({
                  'value': decision,
                  'id': _id
                });

                $http.post('/api/holdingpen/' + _id + '/action/resolve', _data).then(function (response) {
                  var _data = JSON.parse(response.config.data);
                  for (var record_idx in records) {
                    if (+_data.id === +records[record_idx]._id) {
                      var record_obj = records[record_idx]._source;
                      if(!record_obj._extra_data) {
                        record_obj._extra_data = {};
                      }
                      record_obj._extra_data.user_action = decision;
                      record_obj._workflow.status = 'WAITING';
                    }
                  }
                });
              }
              selected_record_ids = [];
            },

            deleteRecord: function (vm, workflowId, reload) {
              $http.delete('/api/holdingpen/' + workflowId, vm.record).then(function (response) {
                vm.ingestion_complete = true;
                if (reload) {
                  window.location = '/holdingpen/list/';
                }
              }).catch(function (value) {
                vm.ingestion_complete = false;
              });
            },

            resumeWorkflow: function (vm, workflowId) {
              $http.post('/api/holdingpen/' + workflowId + '/action/resume').then(function (response) {
                vm.workflow_flag = 'Workflow resumed';
              }).catch(function (value) {
                vm.resumed = false;
              });
            },

            restartWorkflow: function (vm, workflowId) {
              $http.post('/api/holdingpen/' + workflowId + '/action/restart').then(function (response) {
                vm.workflow_flag = 'Workflow restarted';
              }).catch(function (value) {
                vm.restarted = false;
              });
            },

            restartWorkflowStep: function (vm, workflowId) {
              $http.post('/api/holdingpen/' + workflowId + '/action/restart_step').then(function (response) {
                vm.workflow_flag = 'Workflow step restarted';
              }).catch(function (value) {
                vm.restarted = false;
              });
            },

            getLinkToDuplicateDois: function(workflow) {
              var link = 'http://inspirehep.net/search?p=';
              var totalExactMatches = workflow._extra_data.matches.exact.length;
              for(var exactMatch = 0; exactMatch < totalExactMatches; exactMatch++) {
                if(exactMatch !== totalExactMatches - 1) {
                  link = link + 'recid:' + workflow._extra_data.matches.exact[exactMatch] + '+or+';
                } else {
                  link = link + 'recid:' + workflow._extra_data.matches.exact[exactMatch];
                }
              }
              return link;
            },

            hasValidationErrors: function (workflow) {
              if (!workflow) { return false; }
              var _extra_data = workflow._extra_data;
              return _extra_data && _extra_data.validation_errors && _extra_data.validation_errors.length > 0;
            },

            hasCrawlErrors: function (workflow) {
              if (!workflow) { return false; }
              var _extra_data = workflow._extra_data;
              return _extra_data && _extra_data.crawl_errors;
            },

            hasConflicts: function (record) {
              var _extra_data =  record._extra_data;
              return _extra_data && _extra_data.conflicts !== undefined && _extra_data.conflicts.length > 0;
            }
          };
        }
      ]
    )
  ;
}(angular));
