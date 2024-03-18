const mongoose = require("mongoose");

const tasklistSchema = new mongoose.Schema({
    text: String,
});

tasklistSchema.methods.list = function list() {
    const output = this.text
    ? "Task: " + this.text
    : "Task is nonexistent";
}

const Task = mongoose.model("Task", tasklistSchema);
module.exports = { Task };