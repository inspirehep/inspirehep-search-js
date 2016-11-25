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
    if ($scope.vm.invenioSearchArgs.claim === 'true'){
      $scope.vm.SwitchColor = true;
      $scope.vm.ClaimToggled = true;
    }

    //  Getting the current_user
    $http.get('/current_user').then(function (response) {

      if (response.data.status === 'found') {
        $scope.user_is_logged = true;
        $scope.user_full_name = response.data.full_name;
        $scope.user_orcid_id = response.data.orcid_id;
        $scope.user_phonetic_block = response.data.phonetic_block;
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
        window.location.href = '/search?page=1&size=25&claim=true&cc=literature&q=author: "' +
            $scope.user_full_name + '"';
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
            orcid_id: $scope.user_orcid_id,
            phonetic_block: $scope.user_phonetic_block
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
