// Import react and useState/useEffect
import React, { useState, useEffect } from 'react';

function Form() {
    // Declare 2 variables, newTask (input) and tasks (list of created tasks)
    const [newTask, setNewTask] = useState("");
    const [tasks, setTasks] = useState([]);

    // On page load, fetch data from db and add it to list
    useEffect(() => {
        (async () => {
            try {
                // Fetch from localhost
                const response = await fetch("http://localhost:3001", {
                    // Use the get command to get data in db
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS", 
                        "Access-Control-Allow-Headers":
                        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
                    },
                });

                // Save the response into the variable b, and then turn it into a list of objects
                const b = await response.json();
                const list = b.list.map((task) => {
                    return {
                        ...task
                    };
                });

                // save the new list into setTasks()
                setTasks(list);
            } catch (error) {console.log(error);}
        })();
    }, []);

    // Add task
    const addTask = async () => {
        try {
            // If the input box is empty, tell user to add input
            if (!newTask) {
                alert("Task can't be empty");
                return;
            } else {
                // Fetch from localhost
                const response = await fetch("http://localhost:3001/", {
                    // Use post command to add into db
                    method: "POST",
                    // send the new task into the db
                    body: JSON.stringify({ text: newTask }),
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
                    },
                });
                
                // save resposne into var y and add the values into setTasks
                const y = await response.json();
                setTasks([...tasks, {id: y.task.id, text: y.task.text}]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Delete task
    const deleteTask = (id) => async () => {
        try {
            // Fetch from localhost with the delete method, send id with it
            await fetch(`http://localhost:3001/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS", 
                    "Access-Control-Allow-Headers":
                    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
                },
            });

            // Delete the task from user side
            const updatedTasks = tasks.filter((task) => task.id !== id);
            setTasks(updatedTasks);

        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }


    // Edit task  
    const editTask = async (id) => {
        // Ask for a prompt for the new task name
        const editedTask = prompt("Edit task:");
        // if the user submit anything
        if (editedTask) {
            try {
                // Update the db using the put function
                await fetch(`http://localhost:3001/${id}`, {
                    method: "PUT",
                    body: JSON.stringify({ text: editedTask }),
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
                    },
                });

                // Update the task client-side
                const updatedTasks = tasks.map(task => { if (task.id === id) {
                        return { id: id, text: editedTask };
                    }
                    return task;
                });

                setTasks(updatedTasks);

            } catch (error) {
                console.error("Error editing task:", error);
            }
        }
    };

    // List the tasks in a map()
    const listTasks = tasks.map(task => (
        <div key={task.id} className='task'>
            {task.text}
            <div className='buttons'>
                <button onClick={() => editTask(task.id)}>Edit</button>
                <button onClick={deleteTask(task.id)}>Delete</button>
            </div>
        </div>
    ));


    return(
        <div className='tasklist'>
            <div className='tasksearch'>
                <input onChange={(e) => setNewTask(e.target.value)}></input><button onClick={addTask}>Add</button>
            </div>

            <div className='taskcontainer'>
                {listTasks}
            </div>
        </div>
    )
}


export default Form;