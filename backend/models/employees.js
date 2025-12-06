const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, required: true, default: 'Active' },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date },
    startDate: { type: Date },
    residentialAddress: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
