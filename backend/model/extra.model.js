var mongoose = require('mongoose');

var timerSchema = new mongoose.Schema({
    timerId : Number,
    startTime : Number,
    endTime : Number,
    remainingTime : Number
});

const timer = mongoose.model("timer",timerSchema);

module.exports = { timer };