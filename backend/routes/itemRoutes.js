const express = require('express');
const { createItem, getAllItems, getItemById, updateItemQuantity, deleteItem } = require('../Controllers/controller');
const router = express.Router();

router.post('/', createItem);
router.get('/', getAllItems);
router.get('/:id', getItemById);
router.patch('/:id', updateItemQuantity);
router.delete('/:id', deleteItem);

module.exports = router;