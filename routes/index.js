const router = require('express').Router();

const Item = require('../models/item');

router.get('/', async (req, res, next) => {
  const items = await Item.find({});
  res.render('index', {items});
});

router.get('/items/create', async (req, res, next) => {
  res.render('create');
});

router.post('/items/create', async (req, res, next) => {
  const {title, description, imageUrl} = req.body;
  const newItem = new Item({title, description, imageUrl});
  newItem.validateSync();
  if (newItem.errors) {
    res.status(400).render('create', {item: newItem});
  } else {
    await newItem.save();
    res.redirect('/');
  }

});

router.get('/items/:id', async (req, res, next) => {
  const _id = req.params.id;
  const item = await Item.findById(_id);
  res.render('singleItem', item);
});

router.post('/items/:id/delete', async (req, res, next) => {
  const _id = req.params.id;
  const item = await Item.deleteOne({_id: _id});
  res.redirect('/');
});


router.get('/items/:id/update', async (req, res, next) => {
  const _id = req.params.id;
  const item = await Item.findById(_id);
  res.render('update', item);
});

router.post('/items/:id/update', async (req, res, next) => {
  const _id = req.params.id;
  const {title, description, imageUrl} = req.body;
  const updatedItem = Item({title, description, imageUrl});
  updatedItem.validateSync();
  if (updatedItem.errors) {
    res.status(400).render('update', {item: updatedItem});
  } else {
    await Item.findByIdAndUpdate(_id, {title, description, imageUrl});
    res.redirect('/items/' + _id);
  }
});

module.exports = router;
