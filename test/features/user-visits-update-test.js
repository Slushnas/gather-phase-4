const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User creates and views a single item', () => {
  describe('clicks on update', () => {
    it('displays the update page', () => {
      const itemToCreate = buildItemObject();
      browser.url('/items/create');
      browser.setValue('#title-input', itemToCreate.title);
      browser.setValue('#description-input', itemToCreate.description);
      browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
      browser.click('#submit-button');
      browser.click('.view-button a');

      browser.click('.button.update-button');
      
      assert.include(browser.getHTML('#title-input'), itemToCreate.title,
        'Expected update page to include the items title');
      assert.include(browser.getHTML('#description-input'), itemToCreate.description,
        'Expected update page to include the items description');
      assert.include(browser.getHTML('#imageUrl-input'), itemToCreate.imageUrl,
        'Expected update page to include the items imageUrl');
    });
  });
});
