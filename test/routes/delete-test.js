const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id/delete', () => {
  beforeEach(connectDatabaseAndDropData);
  afterEach(diconnectDatabase);

  describe('POST', () => {
    it('deletes the item', async () => {
      const item = await seedItemToDatabase();

      const response = await request(app)
        .post(`/items/${item._id}/delete`)
        .type('form');
      const allItems = await Item.find({title: item.title});

      assert.equal(allItems.length, 0, 'Expected item to be deleted from the database');
    });
  });
});
