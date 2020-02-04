var mongoose = require("mongoose");

var visitedSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true}
});

var visitedModel = mongoose.model('Visited', visitedSchema);

module.exports = visitedModel;