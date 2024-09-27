const mongoose = require('mongoose');
const moment = require('moment'); // To calculate date differences

const customerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    connectionDate: { type: Date, required: true },
    deviceName: { type: String, required: true },
    macAddress: { type: String, required: true },
    price: { type: Number, required: true },
    payAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 }, // New field for due amount
    status: { type: String, default: 'Active' }, // New field for customer status
    remainingDays: { type: Number, default: 30 }, // New field for remaining days
    paymentHistory: [
        {
            amount: Number,
            receiverName: String,
            receiverEmail: String,
            payDate: { type: Date, default: Date.now },
        },
    ],
    actionHistory: [
        {
            action: String,
            performedBy: String,
            date: { type: Date, default: Date.now },
        },
    ],
});

// Function to calculate remaining days
customerSchema.methods.calculateRemainingDays = function () {
    const today = moment();
    const connectionDate = moment(this.connectionDate);
    const daysPassed = today.diff(connectionDate, 'days');
    
    const remainingDays = 30 - daysPassed;
    this.remainingDays = remainingDays > 0 ? remainingDays : 0;
    
    if (remainingDays <= 0) {
        this.status = 'Expired';
    } else {
        this.status = 'Active';
    }

    // Update due amount if applicable
    if (this.payAmount < this.price) {
        this.dueAmount = this.price - this.payAmount;
    } else {
        this.dueAmount = 0;
    }
};

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
