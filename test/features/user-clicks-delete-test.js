const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User creates an item', () => {
  describe('clicks on delete', () => {
    it('displays the main page with the item missing', () => {
      const itemToCreate = buildItemObject();
      browser.url('/items/create');
      browser.setValue('#title-input', itemToCreate.title);
      browser.setValue('#description-input', itemToCreate.description);
      browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
      browser.click('#submit-button');

      browser.click('.delete-button a');

      assert.notInclude(browser.getHTML('body'), itemToCreate.title,
        'Expected main page to be missing the items title');
    });
  });
});
