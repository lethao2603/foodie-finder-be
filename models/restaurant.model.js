const mongoose = require('mongoose');

const mongoose_delete = require('mongoose-delete');

const restaurantCategorySchema = new mongoose.Schema({
    categoryName: String,
})

const restaurantOwnerSchema = new mongoose.Schema({
    nameOwner: String,
    email: String,

})

// const restaurantMenuSchema = new mongoose.mongoose.Schema({
//     name: String,
//     photo: String,
//     price: String,
// })

const restaurantSchema = new mongoose.Schema({
    resname: {
        type: String,
        required: true
    },
    adress: String,
    timeOpen: String,
    timeClose: String,
    seats: String,
    typeOfRes: String,
    averagePrice: String,
    pointEvaluation: String,
    description: String,
    image: String,
    resMenuInfor: [{type: mongoose.Schema.Types.ObjectId, ref: 'menu'}],
    resCateInfor: restaurantCategorySchema,
    resOwnerInfor: restaurantOwnerSchema,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'reviews'}],
    reservations: [{type: mongoose.Schema.Types.ObjectId, ref: 'reservations'}],
    },
    {timestamps: true } // createAt, updateAt
)


restaurantSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Restaurant = mongoose.model('restaurant', restaurantSchema); 

module.exports = Restaurant; 