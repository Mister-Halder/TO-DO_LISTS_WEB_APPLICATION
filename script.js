const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

window.onload = loadTasks;

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    createTask(taskText);
    saveTasks();
    taskInput.value = "";
}

function createTask(text, completed = false) {
    const li = document.createElement("li");
    if (completed) li.classList.add("completed");

   li.innerHTML = `
    <label class="task-item">
        <input type="checkbox" ${completed ? "checked" : ""} onchange="toggleTask(this)">
        <span>${text}</span>
    </label>
    <div class="actions">
        <button class="edit" onclick="editTask(this)">Edit</button>
        <button class="delete" onclick="deleteTask(this)">Delete</button>
    </div>
`;

    taskList.appendChild(li);
}

function toggleTask(element) {
    const li = element.closest("li");
    const span = li.querySelector("span");

    if (element.checked) {
        li.classList.add("completed");
    } else {
        li.classList.remove("completed");
    }

    saveTasks();
}

function editTask(button) {
    const li = button.parentElement.parentElement;
    const span = li.querySelector("span");

    // If already editing → Save
    if (li.classList.contains("editing")) {
        span.contentEditable = "false";
        span.classList.remove("editing-text");
        li.classList.remove("editing");
        button.innerText = "Edit";
        saveTasks();
        return;
    }

    // Start editing
    li.classList.add("editing");
    span.contentEditable = "true";
    span.classList.add("editing-text");
    span.focus();
    button.innerText = "Save";

    // Move cursor to end
    document.getSelection().selectAllChildren(span);
    document.getSelection().collapseToEnd();

    // Keyboard controls
    span.onkeydown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            button.click();
        }
        if (e.key === "Escape") {
            span.contentEditable = "false";
            span.classList.remove("editing-text");
            li.classList.remove("editing");
            button.innerText = "Edit";
        }
    };
}

function deleteTask(button) {
    button.parentElement.parentElement.remove();
    saveTasks();
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("li").forEach(li => {
        tasks.push({
            text: li.querySelector("span").innerText,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => createTask(task.text, task.completed));
}
