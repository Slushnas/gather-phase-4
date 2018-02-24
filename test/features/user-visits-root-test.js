const {assert} = require('chai');

describe('User visits root', () => {
  describe('without existing items', () => {
    it('starts blank', () => {
      browser.url('/');
      assert.equal(browser.getText('#items-container'), '',
        'Expected main page to start with no items present');
    });
  });
  describe('can navigate', () => {
    it('to the create page', () => {
      browser.url('/');
      browser.click('a[href="/items/create"]');
      assert.include(browser.getText('body'), 'Create',
        'Expected to land on the create page');
    });
  });
});
