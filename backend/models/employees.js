const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    employee_id: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
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
