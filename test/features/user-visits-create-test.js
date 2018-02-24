const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visits the create page', () => {
  describe('posts a new item', () => {
    it('and is rendered', () => {
      const itemToCreate = buildItemObject();
      browser.url('/items/create');
      browser.setValue('#title-input', itemToCreate.title);
      browser.setValue('#description-input', itemToCreate.description);
      browser.setValue('#imageUrl-input', itemToCreate.imageUrl);

      browser.click('#submit-button');

      assert.include(browser.getText('body'), itemToCreate.title,
       'Expected main page to include the items title');
      assert.include(browser.getAttribute('body img', 'src'), itemToCreate.imageUrl,
       'Expected main page to include the items imageUrl');
    });
  });
});
