var mongoose = require("mongoose");

var spiderSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    startUrl: {type: String, required: true},
    itemSelector: {type: String, required: true},
    attributes: {type: Array, required: true},
    pipelines: {type: Array, required: false},
    sinks: {type: Array, required: false}
});

var spiderModel = mongoose.model('Spider', spiderSchema);

module.exports = spiderModel;