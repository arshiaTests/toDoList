const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const clearAllButton = document.getElementById("clear-all");
const addTaskButton = document.getElementById("add-task");

// بارگذاری وظایف از Local Storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}

// افزودن وظیفه به DOM و Local Storage
function addTaskToDOM(taskValue) {
    const li = document.createElement("li");
    li.innerHTML = `
        <input type="checkbox" onchange="toggleTask(this)">
        <span class="task-text" onclick="toggleTaskText(this)">${taskValue.text}</span>
        <span class='edit' onclick="editTask(this)">✏️</span>
        <span class='delete' onclick="removeTask(this)">❌</span>
    `;
    const checkbox = li.querySelector("input[type='checkbox']");
    checkbox.checked = taskValue.checked;

    const taskText = li.querySelector(".task-text");
    if (checkbox.checked) {
        taskText.classList.add("checked");
    } else {
        taskText.classList.remove("checked");
    }


    listContainer.appendChild(li);

    // فراخوانی تابع برای تنظیم وضعیت دکمه ویرایش پس از ایجاد
    setEditButtonState(li);
}

// افزودن وظیفه
addTaskButton.addEventListener("click", function () {
    const taskValue = inputBox.value.trim();
    if (taskValue === '') {
        alert("لطفا یک وظیفه معتبر وارد کنید");
        return;
    }

    const taskObject = {
        text: taskValue,
        checked: false
    };

    addTaskToDOM(taskObject);
    saveTaskToLocalStorage(taskObject);
    inputBox.value = ""; // پاک کردن ورودی پس از افزودن وظیفه
});

// ذخیره وظیفه در Local Storage
function saveTaskToLocalStorage(taskValue) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskValue);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// حذف وظیفه
function removeTask(element) {
    const li = element.closest("li");
    const taskText = li.querySelector(".task-text").textContent.trim();
    removeTaskFromLocalStorage(taskText);
    li.remove();
}

// حذف وظیفه از Local Storage
function removeTaskFromLocalStorage(taskValue) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.text !== taskValue);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ویرایش وظیفه
function editTask(element) {
    const li = element.closest("li");
    const taskText = li.querySelector(".task-text");
    const currentText = taskText.textContent.trim();

    const newText = prompt("ویرایش وظیفه:", currentText);
    if (newText !== null && newText.trim() !== '') {
        taskText.textContent = newText.trim();
        updateTaskInLocalStorage(currentText, newText.trim());
    }
}

// به‌روزرسانی وظیفه در Local Storage
function updateTaskInLocalStorage(oldValue, newValue) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskIndex = tasks.findIndex(task => task.text === oldValue);
    if (taskIndex > -1) {
        tasks[taskIndex].text = newValue;
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// تنظیم وضعیت دکمه ویرایش
function setEditButtonState(li) {
    const checkbox = li.querySelector("input[type='checkbox']");
    const editButton = li.querySelector(".edit");

    if (checkbox.checked) {
        editButton.style.pointerEvents = "none";
        editButton.style.opacity = "0.5";
    } else {
        editButton.style.pointerEvents = "auto";
        editButton.style.opacity = "1";
    }
}

// تغییر وضعیت چک‌شده
function toggleTask(checkbox) {
    const li = checkbox.closest("li");
    const taskText = li.querySelector(".task-text");

    if (checkbox.checked) {
        taskText.classList.add("checked");
    } else {
        taskText.classList.remove("checked");
    }

    // تنظیم وضعیت دکمه ویرایش
    setEditButtonState(li);

    // ذخیره وضعیت چک باکس در local storage
    updateTaskCheckStateInLocalStorage(li);
}

function updateTaskCheckStateInLocalStorage(li) {
    const taskText = li.querySelector(".task-text").textContent.trim();
    const checkbox = li.querySelector("input[type='checkbox']");
    const isChecked = checkbox.checked;

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskIndex = tasks.findIndex(task => task.text === taskText);

    if (taskIndex > -1) {
        tasks[taskIndex].checked = isChecked;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}

// تابع toggleTaskText برای تغییر وضعیت چک‌شده با کلیک روی متن تسک
function toggleTaskText(span) {
    const li = span.closest("li");
    const checkbox = li.querySelector("input[type='checkbox']");
    checkbox.checked = !checkbox.checked; // تغییر وضعیت چک باکس
    toggleTask(checkbox); // اعمال وضعیت
}

// عملکرد برای پاک کردن تمام وظایف
clearAllButton.addEventListener("click", function () {
    if (listContainer.children.length > 0) {
        if (confirm("آیا از حذف کل وظایف اطمینان دارید؟")) {
            localStorage.removeItem("tasks");
            listContainer.innerHTML = '';
        }
    }
});

// بارگذاری وظایف هنگام بارگذاری صفحه
loadTasks();  
