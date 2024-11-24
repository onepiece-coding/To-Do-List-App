// Select DOM elements
const tasksEl = document.querySelector(".tasks");
const appFormEl = document.querySelector(".app-form");
const appInputEl = document.getElementById("app-input");
const appMsgEl = document.querySelector(".app-msg");
const clearBtnEl = document.querySelector(".clear-btn");

// Display all tasks on page load
function showTasks() {
    // Clear tasks container
    tasksEl.innerHTML = "";

    // Fetch tasks from localStorage
    const tasksFromLS = getTasksFromLS();

    if (tasksFromLS.length > 0) {
        tasksFromLS.forEach(task => {
            // Add each task to DOM
            createNewTask(task);
        });
        appMsgEl.innerHTML = `You have ${tasksFromLS.length} pending tasks`;
        // Enable clear button
        clearBtnEl.classList.remove("disabled");
    } else {
        appMsgEl.textContent = "No Tasks To Show!";
        // Disable clear button
        clearBtnEl.classList.add("disabled");
    }
}

showTasks(); // Call function to render tasks

// Create and append a new task to the task list
function createNewTask(task) {
    const taskEl = document.createElement("div");
    taskEl.className = "task";

    const taskTitleEl = document.createElement("p");
    taskTitleEl.className = "task-title";
    // Add task title
    taskTitleEl.textContent = task.title;
    taskEl.appendChild(taskTitleEl);

    const deleteBtnEl = document.createElement("button");
    deleteBtnEl.className = "app-btn";
    deleteBtnEl.ariaLabel = "Delete task button" // accessible name
    // Add trash icon
    deleteBtnEl.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    taskEl.appendChild(deleteBtnEl);

    // Add delete functionality to button
    deleteBtnEl.addEventListener("click", function () {
        const sure = confirm("Sure! You want delete this task?");
        if (sure) {
            // Delete From Local Storage
            deleteTaskFromLS(task.id);
            // Refresh task list
            showTasks();
        }
    });

    // Add task to task list
    tasksEl.appendChild(taskEl);
}

// Add a new task when form is submitted
appFormEl.addEventListener("submit", (event) => {
    event.preventDefault();

    if (appInputEl.value.trim() !== "") {
        addNewTaskToLS({
            // Generate unique ID
            id: new Date().getTime(),  
            title: appInputEl.value.trim()
        });
        showTasks(); // Refresh task list
    } else {
        alert("Task Title can't be empty!");
    }

    appInputEl.value = ""; // Clear input field
    appInputEl.focus(); // Focus input field
});

// Clear all tasks
clearBtnEl.addEventListener("click", () => {
    const sure = window.confirm("Sure! You want delete all tasks?");
    if (sure) {
        // Remove tasks from localStorage
        localStorage.removeItem("tasks");
        // Refresh task list
        showTasks();
    }
});

// Utility function to get tasks from localStorage
function getTasksFromLS() {
    return localStorage.getItem("tasks") ?
    // Parse tasks from JSON
    JSON.parse(localStorage.getItem("tasks")) :
    [];
}

// Utility function to add a task to localStorage
function addNewTaskToLS(newTask) {
    const tasksFromLS = getTasksFromLS();
    // Convert to string before send to LS
    localStorage.setItem("tasks", JSON.stringify([...tasksFromLS, newTask]));
}

// Utility function to dlete a task from localStorage
function deleteTaskFromLS(taskId) {
    const tasksFromLS = getTasksFromLS();
    const afterDelete = tasksFromLS.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(afterDelete));
}
