const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/create', () => {
  beforeEach(connectDatabaseAndDropData);
  afterEach(diconnectDatabase);

  describe('GET', () => {
    it('renders empty input fields', async () => {
      const response = await request(app)
        .get('/items/create');

      assert.equal(parseTextFromHTML(response.text, 'input#title-input'), '');
      assert.equal(parseTextFromHTML(response.text, 'textarea#description-input'), '');
      assert.equal(parseTextFromHTML(response.text, 'input#imageUrl-input'), '');
    });
  });

  describe('POST', () => {
    const itemToCreate = buildItemObject();
    async function PostNewItem () {
      return await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);
    };

    it('creates and saves a new item', async () => {
      await PostNewItem();
      const createdItem = await Item.findOne(itemToCreate);
      assert.isOk(createdItem, 'Item was not created successfully in the database');
    });

    it('redirects home', async () => {
      const response = await PostNewItem();
      assert.equal(response.status, 302);
      assert.equal(response.headers.location, '/');
    });

    it('displays an error message when supplied an empty title', async () => {
      itemToCreate.title = '';
      const response = await PostNewItem();

      const allItems = await Item.find({});

      assert.equal(allItems.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('displays an error message when supplied an empty description', async () => {
      itemToCreate.description = '';
      const response = await PostNewItem();

      const allItems = await Item.find({});

      assert.equal(allItems.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('displays an error message when supplied an empty imageUrl', async () => {
      itemToCreate.imageUrl = '';
      const response = await PostNewItem();

      const allItems = await Item.find({});

      assert.equal(allItems.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });
  });
});
