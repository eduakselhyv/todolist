const express = require("express");

const app = require("../app");
const { Task } = require("../mongo/schema");
const router = express.Router();
const task = require("../mongo/testbackend");

router.get("/", async function (req, res, next) {
    const list = await task.getAllTasks();
    console.log(list);
    res.json({ list });
});

router.post("/", async function (req, res, next) {
    try {
        const body = req.body;
        console.log("file: index.js | router.post() | req.body", req.body);

        const save = await task.saveTask({
            text: body.text,
        });

        console.log ("await save task", save);
        console.log("printed: " + JSON.stringify(body));
        res.json({ status: "ok", task: save });

    } catch (error) {
        console.error("Failed to save: ", error);
        res.status(500).json({ status: "ERROR 500" })
    }
});

router.delete("/:id", async function (req, res, next) {
    try {
        const taskId = req.params.id;
        console.log("file: index.js | router.delete() | taskId", taskId);
        const test = await task.deleteTask(taskId);
        res.json({ status: "ok" });
    } catch (error) {
        console.error("Error deleting task", error);
        res.status(500).json({ status: "ERROR 500" });
    }
});

module.exports = router;