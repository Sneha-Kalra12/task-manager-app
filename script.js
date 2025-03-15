class Task {
    constructor(title, description, priority, category) {
      this.title = title;
      this.description = description;
      this.priority = priority;
      this.category = category;
      this.completed = false;
    }
  
    toggleCompleted() {
      this.completed = !this.completed;
    }
  }
  
  class TaskManager {
    constructor() {
      this.tasks = [];
    }
  
    addTask(task) {
      this.tasks.push(task);
      if (task.priority === 'high') {
        this.showNotification(`High priority task "${task.title}" added!`);
      }
      this.renderTasks();
    }
  
    updateTask(index, updatedTask) {
      this.tasks[index] = updatedTask;
      if (updatedTask.priority === 'high') {
        this.showNotification(`High priority task "${updatedTask.title}" updated!`);
      }
      this.renderTasks();
    }
  
    deleteTask(index) {
      const deletedTask = this.tasks.splice(index, 1)[0];
      this.showNotification(`Task "${deletedTask.title}" deleted!`);
      this.renderTasks();
    }
  
    filterTasks(category) {
      return category === "all"
        ? this.tasks
        : this.tasks.filter((task) => task.category === category);
    }
  
    searchTasks(query) {
      return this.tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(query.toLowerCase()) ||
          task.description.toLowerCase().includes(query.toLowerCase())
      );
    }
  
    showNotification(message) {
      const notificationArea = document.getElementById("notification-area");
      const notification = document.createElement("div");
      notification.className = "notification";
      notification.textContent = message;
      notificationArea.appendChild(notification);
  
      // Remove notification after 3 seconds
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  
    renderTasks(filteredTasks = this.tasks) {
      const taskList = document.getElementById("task-list");
      taskList.innerHTML = "";
  
      if (filteredTasks.length === 0) {
        taskList.innerHTML = `<p class="no-tasks">No tasks found. Try a different filter or search!</p>`;
        return;
      }
  
      filteredTasks.forEach((task, index) => {
        const taskElement = document.createElement("div");
        taskElement.className = `task ${task.completed ? "completed" : ""}`;
        taskElement.innerHTML = `
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <p>Priority: ${task.priority}</p>
          <p>Category: ${task.category}</p>
          <button class="complete" onclick="taskManager.toggleCompleted(${index})">${
          task.completed ? "Undo" : "Complete"
        }</button>
          <button class="edit" onclick="taskManager.editTask(${index})">Edit</button>
          <button class="delete" onclick="taskManager.deleteTask(${index})">Delete</button>
        `;
        taskList.appendChild(taskElement);
      });
    }
  
    toggleCompleted(index) {
      const task = this.tasks[index];
      task.toggleCompleted();
      if (task.priority === 'high') {
        this.showNotification(`High priority task "${task.title}" marked as ${task.completed ? "completed" : "incomplete"}!`);
      }
      this.renderTasks();
    }
  
    editTask(index) {
      const task = this.tasks[index];
      const taskElement = document.querySelector(`#task-list .task:nth-child(${index + 1})`);
  
      // Replace task content with input fields for inline editing
      taskElement.innerHTML = `
        <input type="text" class="edit-title" value="${task.title}" placeholder="Task Title">
        <textarea class="edit-description" placeholder="Task Description">${task.description}</textarea>
        <select class="edit-priority">
          <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
          <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
          <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
        </select>
        <select class="edit-category">
          <option value="personal" ${task.category === 'personal' ? 'selected' : ''}>Personal</option>
          <option value="work" ${task.category === 'work' ? 'selected' : ''}>Work</option>
          <option value="urgent" ${task.category === 'urgent' ? 'selected' : ''}>Urgent</option>
        </select>
        <button class="save-edit" onclick="taskManager.saveEdit(${index})">Save</button>
        <button class="cancel-edit" onclick="taskManager.renderTasks()">Cancel</button>
      `;
    }
  
    saveEdit(index) {
      const taskElement = document.querySelector(`#task-list .task:nth-child(${index + 1})`);
      const newTitle = taskElement.querySelector('.edit-title').value;
      const newDescription = taskElement.querySelector('.edit-description').value;
      const newPriority = taskElement.querySelector('.edit-priority').value;
      const newCategory = taskElement.querySelector('.edit-category').value;
  
      if (newTitle && newPriority && newCategory) {
        const updatedTask = new Task(newTitle, newDescription, newPriority, newCategory);
        this.updateTask(index, updatedTask);
      }
    }
  }
  
  // Initialize TaskManager
  const taskManager = new TaskManager();
  
  // Event Listeners
  document.getElementById("task-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;
    const priority = document.getElementById("task-priority").value;
    const category = document.getElementById("task-category").value;
  
    if (title && priority && category) {
      const task = new Task(title, description, priority, category);
      taskManager.addTask(task);
      e.target.reset();
    } else {
      alert("Please fill in all required fields!");
    }
  });
  
  document.getElementById("category-filter").addEventListener("change", (e) => {
    const filteredTasks = taskManager.filterTasks(e.target.value);
    taskManager.renderTasks(filteredTasks);
  });
  
  document.getElementById("search").addEventListener("input", (e) => {
    const searchedTasks = taskManager.searchTasks(e.target.value);
    taskManager.renderTasks(searchedTasks);
  });
  
  document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const themeToggleButton = document.getElementById("theme-toggle");
    if (document.body.classList.contains("dark-mode")) {
      themeToggleButton.textContent = "Light Mode";
    } else {
      themeToggleButton.textContent = "Dark Mode";
    }
  });