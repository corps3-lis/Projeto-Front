// Elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// Funções
const saveTodo = (text, done = 0) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");
  todo.innerHTML = `
    <h3>${text}</h3>
    <button class="finish-todo"><i class="fa-solid fa-check"></i></button>
    <button class="edit-todo"><i class="fa-solid fa-pen"></i></button>
    <button class="remove-todo"><i class="fa-solid fa-xmark"></i></button>
  `;
  if (done) todo.classList.add("done");
  todoList.appendChild(todo);
  saveTodoLocalStorage({ text, done: 0 });
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todoTitleElements = document.querySelectorAll(".todo h3");
  todoTitleElements.forEach((todoTitleElement) => {
    if (todoTitleElement.innerText === oldInputValue) {
      todoTitleElement.innerText = text;
      updateTodoLocalStorage(oldInputValue, text);
    }
  });
  oldInputValue = ""; // Limpar o valor antigo após a edição 
};

const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");
  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();
    todo.style.display = todoTitle.includes(search.toLowerCase()) ? "flex" : "none";
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");
  todos.forEach((todo) => {
    const isDone = todo.classList.contains("done");
    const isVisible =
      filterValue === "all" ||
      (filterValue === "done" && isDone) ||
      (filterValue === "todo" && !isDone);
    todo.style.display = isVisible ? "flex" : "none";
  });
};

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = todoInput.value.trim();
  if (inputValue) saveTodo(inputValue);

  todoInput.value = "";
  todoInput.focus();
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle = parentEl?.querySelector("h3")?.innerText;
  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");
    updateTodoStatusLocalStorage(todoTitle);
  }
  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();
    removeTodoLocalStorage(todoTitle);
  }
  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();
    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const editInputValue = editInput.value.trim();
  if (editInputValue) updateTodo(editInputValue);
  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  getSearchedTodos(e.target.value);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  getSearchedTodos("");
});

filterBtn.addEventListener("change", (e) => {
  filterTodos(e.target.value);
});


