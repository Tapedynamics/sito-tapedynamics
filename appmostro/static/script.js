document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Fetch and display tasks when the page loads
    loadTasks();

    // Add task when button is clicked
    addTaskBtn.addEventListener('click', addTask);

    // Add task when Enter key is pressed
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Function to load tasks from the backend
    function loadTasks() {
        fetch('/api/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                if (tasks.length === 0) {
                    taskList.innerHTML = '<li class="empty-state">No tasks yet. Add one above!</li>';
                } else {
                    tasks.forEach(task => {
                        addTaskToDOM(task);
                    });
                }
            })
            .catch(error => {
                console.error('Error loading tasks:', error);
                taskList.innerHTML = '<li class="empty-state">Error loading tasks</li>';
            });
    }

    // Function to add a new task
    function addTask() {
        const text = taskInput.value.trim();
        if (text === '') return;

        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        })
        .then(response => response.json())
        .then(task => {
            addTaskToDOM(task);
            taskInput.value = '';
            taskInput.focus();
        })
        .catch(error => {
            console.error('Error adding task:', error);
            alert('Error adding task');
        });
    }

    // Function to add a task to the DOM
    function addTaskToDOM(task) {
        // Remove empty state if it exists
        if (taskList.querySelector('.empty-state')) {
            taskList.innerHTML = '';
        }

        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        `;
        
        taskList.appendChild(li);
        
        // Add event listener to the delete button
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });
    }

    // Function to delete a task
    function deleteTask(id) {
        fetch(`/api/tasks/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            // Remove the task from the DOM
            const taskItem = document.querySelector(`.delete-btn[data-id="${id}"]`).closest('.task-item');
            taskItem.remove();
            
            // Show empty state if no tasks left
            if (taskList.children.length === 0) {
                taskList.innerHTML = '<li class="empty-state">No tasks yet. Add one above!</li>';
            }
        })
        .catch(error => {
            console.error('Error deleting task:', error);
            alert('Error deleting task');
        });
    }
});