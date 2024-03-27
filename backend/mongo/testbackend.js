const mongoose = require("mongoose");
const { Task } = require("./schema");

// Function to get all tasks in db using .find()
async function getAllTasks(params) {
    const allTasks = await Task.find();

    return allTasks.map((k) => {
        return {
            id: k._id.toHexString(),
            text: k.text,
        };
    });
}

// Save the text gotten from react into db using .create()
async function saveTask(task) {

    const saveTask = await Task.create({
        text: task.text,
    });

    console.log("saved task's id: ", saveTask);
    const taskId = saveTask._id.toHexString();

    return {
        id: taskId,
        text: task.text,
    };
}

// Delete a task with a specific id from db using .deleteOne() 
// I had to modify this myself a bit, since some stuff had changed.
async function deleteTask(id) {
    try {
        const x = await Task.deleteOne({ _id: new mongoose.Types.ObjectId(id) });

        if (x && !x.deletedCount) {
            throw new Error("No tasks were deleted");
        }

    } catch (error) {
        console.error("Failed to delete object!: ", error);
        throw error;
    }
}

// I created a separate function for editing tasks
async function putTask(id, task) {
    try {
        // if _id matches the id provided, then update the text of that specific object into the provided text.
        const x = await Task.updateOne({ _id: id }, {text: task});

    } catch (error) {
        console.error("Failed to update object!: ", error);
        throw error;
    }
}

// Export functions
module.exports = { getAllTasks, saveTask, deleteTask, putTask };