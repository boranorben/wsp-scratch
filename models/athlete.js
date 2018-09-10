let mongoose = require('mongoose');
// Athlete Schema
let athleteSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        clubName: {
            type: String,
            require: true
        },
        author: {
            type: String,
            require: true
        },
        body: {
            type: String,
            require: true
        }
    }
)

let Athlete = module.exports = mongoose.model('Athlete', athleteSchema);