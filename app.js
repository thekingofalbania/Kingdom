// DOM elements
const newTodoInput = document.getElementById('new-todo');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');
const clearCompletedButton = document.getElementById('clear-completed');
const itemsLeftSpan = document.getElementById('items-left');
const installBanner = document.getElementById('install-banner');
const closeBannerButton = document.getElementById('close-banner');

// Todo array to store all todos
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Function to save todos to local storage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    updateItemsLeft();
}

// Function to create a new todo item
function createTodoItem(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', toggleTodoComplete);
    
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.innerHTML = '×';
    deleteButton.addEventListener('click', deleteTodo);
    
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);
    
    return li;
}

// Function to render all todos
function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        todoList.appendChild(createTodoItem(todo));
    });
    updateItemsLeft();
}

// Function to add a new todo
function addTodo() {
    const text = newTodoInput.value.trim();
    if (text) {
        const todo = {
            id: Date.now().toString(),
            text,
            completed: false
        };
        todos.push(todo);
        todoList.appendChild(createTodoItem(todo));
        newTodoInput.value = '';
        saveTodos();
        
        // Add animation effect
        const lastItem = todoList.lastElementChild;
        lastItem.style.opacity = '0';
        lastItem.style.transform = 'translateY(10px)';
        setTimeout(() => {
            lastItem.style.opacity = '1';
            lastItem.style.transform = 'translateY(0)';
        }, 10);
    }
}

// Function to toggle todo completion status
function toggleTodoComplete(e) {
    const todoId = e.target.parentElement.dataset.id;
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
        todo.completed = e.target.checked;
        e.target.parentElement.classList.toggle('completed', todo.completed);
        saveTodos();
    }
}

// Function to delete a todo
function deleteTodo(e) {
    const todoItem = e.target.parentElement;
    const todoId = todoItem.dataset.id;
    
    // Add fade out animation
    todoItem.style.opacity = '0';
    todoItem.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
        todos = todos.filter(todo => todo.id !== todoId);
        todoList.removeChild(todoItem);
        saveTodos();
    }, 300);
}

// Function to clear all completed todos
function clearCompleted() {
    const completedItems = todoList.querySelectorAll('.completed');
    completedItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(-10px)';
    });
    
    setTimeout(() => {
        todos = todos.filter(todo => !todo.completed);
        renderTodos();
        saveTodos();
    }, 300);
}

// Function to update the items left counter
function updateItemsLeft() {
    const itemsLeft = todos.filter(todo => !todo.completed).length;
    itemsLeftSpan.textContent = itemsLeft;
}

// Event listeners
addButton.addEventListener('click', addTodo);
newTodoInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        addTodo();
    }
});
clearCompletedButton.addEventListener('click', clearCompleted);

// Show the install banner for iOS users
let deferredPrompt;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if (isIOS && !localStorage.getItem('bannerDismissed')) {
    setTimeout(() => {
        installBanner.style.display = 'flex';
    }, 2000);
}

closeBannerButton.addEventListener('click', () => {
    installBanner.style.display = 'none';
    localStorage.setItem('bannerDismissed', 'true');
});

// Initial render
renderTodos();
