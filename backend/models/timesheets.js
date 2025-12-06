const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    timeSpent: {
        type: String,
        required: true,
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    notes: {
        type: String,
    },
    type: {
        type: String,
        enum: ['Development', 'Testing', 'Other'],
        required: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Timesheet', timesheetSchema);

