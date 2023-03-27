const {Schema, model} = require('mongoose');

const schema = new Schema ({
    nameDoctor: {type: String, required: true},
    dateMeeting: {type: Date, required: true},
    timeMeetingHours: {type: Number, required: true},
    timeMeetingMinutes: {type: Number, required: true},
    address: {type: String, required: true},
    email: {type: String, required: true}
});

module.exports = model('Ticket', schema);