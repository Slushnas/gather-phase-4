const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User creates an item', () => {
  describe('clicks view to see the single item', () => {
    it('displays the items description', () => {
      const itemToCreate = buildItemObject();
      browser.url('/items/create');
      browser.setValue('#title-input', itemToCreate.title);
      browser.setValue('#description-input', itemToCreate.description);
      browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
      browser.click('#submit-button');

      browser.click('.view-button a');

      assert.include(browser.getText('body'), itemToCreate.description,
        'Expected the single item page to display the items description.');
    });
  });
});
