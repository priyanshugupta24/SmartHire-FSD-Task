var mongoose = require('mongoose');

var testSchema = new mongoose.Schema({
    userId : Number,
    answer: {
        type: mongoose.Schema.Types.Mixed,
        default: {
            question1: [false, false, false, false],
            question2: [false, false, false, false],
            question3: [false, false, false, false],
            question4: [false, false, false, false],
            question5: [false, false, false, false],
            question6: [false, false, false, false],
            question7: [false, false, false, false],
            question8: [false, false, false, false],
            question9: [false, false, false, false],
            question10: [false, false, false, false]
        }
    },
});

const test = mongoose.model("Test", testSchema);

module.exports = { test };