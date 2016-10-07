(function () {
  'use strict';

  angular
    .module('offers')
    .controller('OffersListController', OffersListController);

  OffersListController.$inject = ['OffersService'];

  function OffersListController(OffersService) {
    var vm = this;

    vm.offers = OffersService.query();
  }
})();
