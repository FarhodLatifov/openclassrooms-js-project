class UserManager {
  constructor() {
    const saved = localStorage.getItem("my_users");
    this.users = saved ? JSON.parse(saved) : [];
  }

  async addUser(name, age) {
    // Guard Clauses
    if (name.length < 3) throw new Error("Имя слишком короткое");
    if (age < 18) throw new Error("Только для лиц старше 18 лет");

    // Имитация задержки сети
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newUser = { id: Date.now(), name, age }; // Добавляем ID для точного удаления
    this.users.push(newUser);
    this.save();
  }

  deleteUser(id) {
    this.users = this.users.filter((user) => user.id !== id);
    this.save();
  }

  save() {
    localStorage.setItem("my_users", JSON.stringify(this.users));
  }
}

const manager = new UserManager();

// Элементы DOM
const nameInput = document.getElementById("nameInput");
const ageInput = document.getElementById("ageInput");
const addBtn = document.getElementById("addBtn");
const errorBox = document.getElementById("errorBox");
const userList = document.getElementById("userList");
const userCount = document.getElementById("userCount");

function render() {
  userList.innerHTML =
    manager.users.length === 0
      ? '<p style="color: #94a3b8; text-align: center;">Список пуст</p>'
      : "";

  manager.users.forEach((user) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <div>
                <strong>${user.name}</strong> 
                <span style="color: #64748b; font-size: 0.9em;">(${user.age} лет)</span>
            </div>
            <button class="delete-btn" onclick="handleDelete(${user.id})">Удалить</button>
        `;
    userList.appendChild(li);
  });
  userCount.textContent = manager.users.length;
}

// Глобальная функция для удаления (чтобы onclick в HTML сработал)
window.handleDelete = (id) => {
  manager.deleteUser(id);
  render();
};

addBtn.addEventListener("click", async () => {
  errorBox.textContent = "";
  const name = nameInput.value.trim();
  const age = Number(ageInput.value);

  try {
    addBtn.disabled = true;
    addBtn.textContent = "Сохранение...";

    await manager.addUser(name, age);

    nameInput.value = "";
    ageInput.value = "";
    render();
  } catch (err) {
    errorBox.textContent = err.message;
  } finally {
    addBtn.disabled = false;
    addBtn.textContent = "Добавить пользователя";
  }
});

// Первый запуск
render();
