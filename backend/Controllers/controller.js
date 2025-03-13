const Item = require('../Model/itemmodel');

exports.createItem = async (req, res) => {
  try {
    const { name, modelId, color, quantity } = req.body;
    const item = new Item({ name, modelId, color, quantity });
    await item.save();
    res.status(201).json({ message: 'Item added successfully', item });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.editItem= async (req, res) => {
  try {
    const { name, modelId, color, quantity } = req.body;
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { name, modelId, color, quantity },
      { new: true }
    );
    updatedItem.save();
  
    if (!updatedItem) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item updated successfully", updatedItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getAllItems = async (req, res) => {
  try {
    let { page = 1, limit = 5 } = req.query; 
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const items = await Item.find().skip(skip).limit(limit);
    const totalItems = await Item.countDocuments();
    
    res.json({
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.quantity = quantity;
    await item.save();
    res.json({ message: 'Item updated successfully', item });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};