import React, { useState, useEffect } from 'react';

function Form() {
    const [newTask, setNewTask] = useState("");
    const [tasks, setTasks] = useState([]);
    
    function editTask(userinput){
        setNewTask(userinput);
    }

    function addTask(){
        setTasks([...tasks, newTask]);
    }

    function deleteTask(target){
        setTasks(tasks.filter(task => task !== target));
    }

    const listTasks = tasks.map(task => 
        <>
            <div className='task'>
                {task}
                <div className='buttons'>
                    <button>Edit</button><button onClick={(e) => deleteTask(task)}>Delete</button>
                </div>
            </div>
        </>
    );

    return(
        <div className='tasklist'>
            <div className='tasksearch'>
                <input onChange={(e) => editTask(e.target.value)}></input><button onClick={addTask}>Add</button>
            </div>

            <div className='taskcontainer'>
                {listTasks}
            </div>
        </div>
    )
}


export default Form;