const mongoose = require('mongoose');

const mongoose_delete = require('mongoose-delete');

const bookingSchema = new mongoose.Schema({
    customerName: {type: String, require: true},
    email: {type: String, require: true},
    phoneNumber: {type: String, require: true},
    date: { type: Date, required: true },
    time: { type: String, required: true },
    numberOfPeople: { type: Number, required: true },
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

const Booking = mongoose.model('booking', bookingSchema); 

module.exports = Booking;