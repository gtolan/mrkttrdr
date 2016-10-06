'use strict';

describe('Offers E2E Tests:', function () {
  describe('Test Offers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/offers');
      expect(element.all(by.repeater('offer in offers')).count()).toEqual(0);
    });
  });
});
