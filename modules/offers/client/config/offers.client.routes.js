(function () {
  'use strict';

  angular
    .module('offers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('offers', {
        abstract: true,
        url: '/offers',
        template: '<ui-view/>'
      })
      .state('offers.list', {
        url: '',
        templateUrl: 'modules/offers/client/views/list-offers.client.view.html',
        controller: 'OffersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Offers List'
        }
      })
      .state('offers.create', {
        url: '/create',
        templateUrl: 'modules/offers/client/views/form-offer.client.view.html',
        controller: 'OffersController',
        controllerAs: 'vm',
        resolve: {
          offerResolve: newOffer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Offers Create'
        }
      })
      .state('offers.edit', {
        url: '/:offerId/edit',
        templateUrl: 'modules/offers/client/views/form-offer.client.view.html',
        controller: 'OffersController',
        controllerAs: 'vm',
        resolve: {
          offerResolve: getOffer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Offer {{ offerResolve.name }}'
        }
      })
      .state('offers.view', {
        url: '/:offerId',
        templateUrl: 'modules/offers/client/views/view-offer.client.view.html',
        controller: 'OffersController',
        controllerAs: 'vm',
        resolve: {
          offerResolve: getOffer
        },
        data:{
          pageTitle: 'Offer {{ articleResolve.name }}'
        }
      })
      .state('offers.accepted', {
      url: '/:offerId/accepted',
      templateUrl: 'modules/offers/client/views/view-accepted-offer.client.view.html',
      controller: 'OffersController',
      controllerAs: 'vm',
      resolve: {
        offerResolve: getOffer
      },
      data: {
        pageTitle: 'Offer {{ articleResolve.name }}'
      }
    }).state('offers.payment', {
      url: '/:offerId/accepted/payment',
      templateUrl: 'modules/offers/client/views/accepted-offer-payment.client.view.html',
      controller: 'PaymentsController',
      controllerAs: 'vm',
      resolve: {
        offerResolve: getOffer
      },
      data: {
        pageTitle: 'Offer {{ articleResolve.name }}'
      }
    }).state('offers.review', {
      url: '/:offerId/review',
      templateUrl: 'modules/offers/client/views/leave-review-offer.client.view.html',
      controller: 'OffersController',
      controllerAs: 'vm',
      resolve: {
        offerResolve: getOffer
      }
    });
  }

  getOffer.$inject = ['$stateParams', 'OffersService'];

  function getOffer($stateParams, OffersService) {
    return OffersService.get({
      offerId: $stateParams.offerId
    }).$promise;
  }

  newOffer.$inject = ['OffersService'];

  function newOffer(OffersService) {
    return new OffersService();
  }
})();
