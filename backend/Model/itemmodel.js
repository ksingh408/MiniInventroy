const mongoose=require('mongoose');


const itemSchema = new mongoose.Schema({
        name: { type: String, required: true },
        modelId: { type: String, required: true },
        color: { type: String, required: true },
        quantity: { type: Number, required: true, min: 0 },
        status: { type: String, enum: ['In Stock', 'Out of Stock'], default: 'In Stock' }
      });
      
      // Composite index to ensure unique modelId + color
      itemSchema.index({ modelId: 1, color: 1 }, { unique: true });
      
      // Middleware to update status
      itemSchema.pre('save', function (next) {
        this.status = this.quantity === 0 ? 'Out of Stock' : 'In Stock';
        next();
      });
      
      module.exports = mongoose.model('Item', itemSchema);