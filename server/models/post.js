const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    
    title:{
        type: Array(),
        // type: String,//Array(),
        require: true,
        unique: true
    },

    description:{
        type: String,
    },

    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },

    state:{
        type: String,
        enum: ["draft", "published"],
        default: "draft"
    },

    reading_count:{
        type: Number,
        default: 0
    },

    reading_time: {type: String},
    
    tags: {
        type: String
    },

    body:{
        type: String,
        require: true
    },
  
    createdAt:{
        type: Date,
        default: Date.now
    },

    updatedAt:{
        type: Date,
        default: Date.now
    }   
});

module.exports = mongoose.model("Post", PostSchema);