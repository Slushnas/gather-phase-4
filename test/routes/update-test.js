const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const app = require('../../app');

const {parseTextFromHTML,
   parseAttributeFromHTML,
   seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');
const Item = require('../../models/item');

describe('Server path: /items/:id/update', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  describe('GET', () => {
    it('renders an items title', async () => {
        const item = await seedItemToDatabase();
        const response = await request(app)
          .get(`/items/${item._id}/update`);
        assert.include(parseAttributeFromHTML(response.text, '#title-input', 'value'), item.title,
         'The items title was not found on the page.');
    });

    it('renders an items description', async () => {
      const item = await seedItemToDatabase();
      const response = await request(app)
        .get(`/items/${item._id}/update`);
      assert.include(parseTextFromHTML(response.text, '#description-input'), item.description,
       'The items description was not found on the page.');
    });

    it('renders an items imageUrl', async () => {
      const item = await seedItemToDatabase();
      const response = await request(app)
        .get(`/items/${item._id}/update`);
      assert.include(parseAttributeFromHTML(response.text, '#imageUrl-input', 'value'), item.imageUrl,
       'The items imageUrl was not found on the page.');
    });
  });

  describe('POST', () => {
    it('updates an already created item', async () => {
      const item = await seedItemToDatabase();
      const newItemInfo = {
        title: 'Elon Musk',
        description: 'Founder of SpaceX.',
        imageUrl: 'https://www.biography.com/.image/t_share/MTE1ODA0OTcxOTUyMDE0ODYx/elon-musk-20837159-1-402.png'
      };

      const response = await request(app)
        .post(`/items/${item._id}/update`)
        .type('form')
        .send(newItemInfo);
      const updatedItem = await Item.findOne({'title': newItemInfo.title});

      assert.equal(newItemInfo.title, updatedItem.title, 'The items title was not updated.');
      assert.equal(newItemInfo.description, updatedItem.description, 'The items description was not updated.');
      assert.equal(newItemInfo.imageUrl, updatedItem.imageUrl, 'The items imageUrl was not updated.');
    });

    it('redirects to the single item page after update', async () => {
      const item = await seedItemToDatabase();
      const newItemInfo = {
        title: 'Elon Musk',
        description: 'Founder of SpaceX.',
        imageUrl: 'https://www.biography.com/.image/t_share/MTE1ODA0OTcxOTUyMDE0ODYx/elon-musk-20837159-1-402.png'
      };

      const response = await request(app)
        .post(`/items/${item._id}/update`)
        .type('form')
        .send(newItemInfo);
      const updatedItem = await Item.findOne({'title': newItemInfo.title});

      assert.equal(response.status, 302, 'Expected 302 redirect response status.');
      assert.equal(response.headers.location, `/items/${item._id}`,
         `Expected to be redirected to /items/${item._id}`);
    });

    it('displays an error message when supplied an empty title', async () => {
      const item = await seedItemToDatabase();
      const invalidItem = {
        title: '',
        description: 'Founder of SpaceX',
        imageUrl: 'https://www.biography.com/.image/t_share/MTE1ODA0OTcxOTUyMDE0ODYx/elon-musk-20837159-1-402.png'
      };

      const response = await request(app)
        .post(`/items/${item._id}/update`)
        .type('form')
        .send(invalidItem);
      const allItems = await Item.find({description: invalidItem.description});

      assert.equal(allItems.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('displays an error message when supplied an empty description', async () => {
      const item = await seedItemToDatabase();
      const invalidItem = {
        title: 'Elon Musk',
        description: '',
        imageUrl: 'https://www.biography.com/.image/t_share/MTE1ODA0OTcxOTUyMDE0ODYx/elon-musk-20837159-1-402.png'
      };

      const response = await request(app)
        .post(`/items/${item._id}/update`)
        .type('form')
        .send(invalidItem);
      const allItems = await Item.find({title: invalidItem.title});

      assert.equal(allItems.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('displays an error message when supplied an empty imageUrl', async () => {
      const item = await seedItemToDatabase();
      const invalidItem = {
        title: 'Elon Musk',
        description: 'Founder of SpaceX',
        imageUrl: ''
      };

      const response = await request(app)
        .post(`/items/${item._id}/update`)
        .type('form')
        .send(invalidItem);
      const allItems = await Item.find({title: invalidItem.title});

      assert.equal(allItems.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });
  });

});
