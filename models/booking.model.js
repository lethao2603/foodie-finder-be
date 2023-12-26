const mongoose = require('mongoose');
const Restaurant = require('./restaurant.model');
const mongoose_delete = require('mongoose-delete');

const bookingSchema = new mongoose.Schema({
    customerName: {type: String, required: [true, "Name must not be empty"]},
    email: {type: String, required: [true, "Email must not be empty"]},
    phoneNumber: {type: String, required: [true, "Phone number must not be empty"]},
    date: { type: Date, required: [true, "Date must not be empty"],
        validate: [dateValidator, "Date cannot be in the past"]},
    time: { type: String, required: [true, "Time must not be empty"]},
    numberOfPeople: { type: Number, required: [true, "Number of people must not be empty"]},
    status: { type: String, default: 'pending' }, // 'pending', 'accepted', 'rejected' 
    resInfor: {type: mongoose.Schema.Types.ObjectId, ref: 'restaurant'},
    cusInfor: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    },
    { timestamps: { createdAt: 'created_at'}} // createAt
)

bookingSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

bookingSchema.index({customerName: 'text',
    email: 'text',phoneNumber: 'text'
});

bookingSchema.pre(/^find/, function(next){
    this.populate({
        path: 'resInfor',
        select: 'resname'
    });
    next();
});

bookingSchema.pre('save', async function (next) {
    try {
        const restaurant = await Restaurant.findById(this.resInfor);

        if (!restaurant) {
            return next(new Error('Restaurant not found'));
        }

        if (this.numberOfPeople > restaurant.seats) {
            return next(new Error('Number of people exceeds available seats'));
        }

        next();
    } catch (error) {
        return next(error);
    }
});

function dateValidator(value) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        value.setHours(0, 0, 0, 0);
      // Check if the date is not in the past
    return value >= currentDate;
};

const Booking = mongoose.model('booking', bookingSchema); 

module.exports = Booking;