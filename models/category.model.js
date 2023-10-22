const mongoose = require('mongoose');

const mongoose_delete = require('mongoose-delete');

const categorySchema = new mongoose.Schema({
    categoryName : {type: String, require: true},
    },
    {timestamps: true } // createAt, updateAt
)

categorySchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Category = mongoose.model('category', categorySchema); 

module.exports = Category;