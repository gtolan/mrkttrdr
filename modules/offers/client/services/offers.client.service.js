//Offers service used to communicate Offers REST endpoints
(function () {
  'use strict';

  angular
    .module('offers')
    .factory('OffersService', OffersService);

  OffersService.$inject = ['$resource'];

  function OffersService($resource) {
    return $resource('api/offers/:offerId', {
      offerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
