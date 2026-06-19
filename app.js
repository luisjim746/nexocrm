// =====================================================
// app.js — Mini CRM Dashboard
// Depends on: data.js (must be loaded before this file)
//
// Structure:
//   1. Constants and state
//   2. Persistence
//   3. DOM helpers
//   4. Table rendering
//   5. Metrics
//   6. Filters
//   7. Inline status editing
//   8. Side panel and form
//   9. Event initialization
// =====================================================


// =====================================================
// 1. Constants and state
// =====================================================

const STATUS_CLASS = {
  Nuevo: "status--prospect",
  Contactado: "status--active",
  "En proceso": "status--inactive",
  Cerrado: "status--active",
  Perdido: "status--at-risk",
};

const PRIORITY_CLASS = {
  Alta: "status--at-risk",
  Media: "status--prospect",
  Baja: "status--inactive",
};

const AVATAR_COLORS = ["avatar--a", "avatar--b", "avatar--c", "avatar--d", "avatar--e"];
const STATUS_OPTIONS = ["Nuevo", "Contactado", "En proceso", "Cerrado", "Perdido"];
const STORAGE_KEY = "crm_clients";


const filters = {
  status: "all",
  priority: "all",
  search: "",
};

// =====================================================
// 2. Persistence
// =====================================================

function saveClients() {
  const clientsAsString = JSON.stringify(clients);
  localStorage.setItem(STORAGE_KEY, clientsAsString);
  console.log(`💾 ${clients.length} clientes guardados.`);
}

function loadClients() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    const parsed = JSON.parse(stored);
    // Keep the original array reference from data.js while replacing its content.
    clients.length = 0;
    parsed.forEach(function (c) { clients.push(c); });
    console.log(`📂 ${clients.length} clientes cargados.`);
  } else {
    console.log("📂 Sin datos guardados. Usando datos mock iniciales.");
  }
}


// =====================================================
// 3. DOM helpers
// =====================================================

function setElementText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function getSearchInput() {
  return document.querySelector(".search-input");
}


function showFieldError(errorId, inputId, message) {
  const errorEl = document.getElementById(errorId);
  const inputEl = document.getElementById(inputId);

  if (errorEl) {
    if (message) errorEl.textContent = message;
    errorEl.style.display = "block"; 
  }
  
  if (inputEl) {
    inputEl.classList.add("form-input--error");
  }
}

function clearError(errorId, inputId) {
  const errorEl = document.getElementById(errorId);
  const inputEl = document.getElementById(inputId);

  if (errorEl) errorEl.style.display = "none";
  if (inputEl) inputEl.classList.remove("form-input--error");
}

function clearAllErrors() {
  clearError("errorName", "inputName");
  clearError("errorCompany", "inputCompany");
  clearError("errorEmail", "inputEmail");
}



// =====================================================
// 4. Table rendering
// =====================================================

function getInitials(fullName) {
  return fullName
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getAvatarColor(index) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function createBadge(text, classMap) {
  const cssClass = classMap[text] || "status--inactive";
  return `<span class="status-badge ${cssClass}">${text}</span>`;
}

function createStatusSelect(client) {
  const options = STATUS_OPTIONS.map(function (status) {
    const isSelected = status === client.status ? "selected" : "";
    return `<option value="${status}" ${isSelected}>${status}</option>`;
  }).join("");

  return `
    <select
      class="status-select ${STATUS_CLASS[client.status] || "status--inactive"}"
      data-client-id="${client.id}"
    >
      ${options}
    </select>
  `;
}

function createClientRow(client, index) {
  const initials = getInitials(client.name);
  const avatarColor = getAvatarColor(index);
  const statusSelect = createStatusSelect(client);
  const priorityBadge = createBadge(client.priority, PRIORITY_CLASS);
  const dateText = formatDate(client.lastContact);

  return `
    <tr>
      <td>
        <div class="client-cell">
          <div class="client-avatar ${avatarColor}">${initials}</div>
          <div>
            <div class="client-name">${client.name}</div>
            <div class="client-company">${client.company}</div>
          </div>
        </div>
      </td>

      <td class="cell-muted">${client.email}</td>

      <td>${statusSelect}</td>

      <td>${priorityBadge}</td>

      <td class="cell-muted">${dateText}</td>

      <td>
        <button class="row-action-btn">Ver →</button>
      </td>
    </tr>
  `;
}


function renderClients(clientList) {
  const tbody = document.querySelector(".data-table tbody");

  if (!tbody) {
    console.error("No se encontró el tbody de la tabla.");
    return;
  }

  const rowsHTML = clientList.map((client, index) => {
    return createClientRow(client, index);
  });

  tbody.innerHTML = rowsHTML.join("");

  // The table is rebuilt on every render, so status select listeners must be reattached.
  initStatusSelects();
  console.log(`✅ ${clientList.length} clientes en tabla.`);
}

// =====================================================
// 5. Metrics
// =====================================================

function countByStatus(clientList, status) {
  return clientList.filter(function (client) {
    return client.status === status;
  }).length;
}


function updateMetrics(clientList) {

  const total = clientList.length;
  setElementText("metric-total", total);
  setElementText("metric-total-footer", `${total} clientes en total`);

  const newClients = countByStatus(clientList, "Nuevo");
  setElementText("metric-nuevos", newClients);
  setElementText("metric-nuevos-footer", `De ${total} clientes totales`);

  const closedClients = countByStatus(clientList, "Cerrado");
  const closedRate = total === 0 ? 0 : Math.round((closedClients / total) * 100);
  setElementText("metric-cerrados", `${closedRate}%`);
  setElementText("metric-cerrados-footer", `${closedClients} cierres sobre ${total}`);
}


// =====================================================
// 6. Filters
// =====================================================

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function filterBySearch(clientList, searchText) {
  if (searchText === "") return clientList;

  const query = normalizeText(searchText);

  return clientList.filter(function (client) {
    const clientName = normalizeText(client.name);
    const clientCompany = normalizeText(client.company);

    return clientName.includes(query) || clientCompany.includes(query);
  });
}

function filterByStatus(clientList, status) {
  if (status === "all") return clientList;

  return clientList.filter(function (client) {
    return client.status === status;
  });
}

function filterByPriority(clientList, priority) {
  if (priority === "all") return clientList;

  return clientList.filter(function (client) {
    return client.priority === priority;
  });
}

function applyFilters() {
  let result = clients;

  result = filterByStatus(result, filters.status);
  result = filterByPriority(result, filters.priority);
  result = filterBySearch(result, filters.search);

  renderClients(result);
}

function refreshUI() {
  updateMetrics(clients);
  applyFilters();
}

// =====================================================
// 7. Inline status editing
// =====================================================

function updateClientStatus(clientId, newStatus) {
  const client = clients.find(c => c.id == clientId);

  if (!client) {
    console.error("❌ Cliente no encontrado:", clientId);
    return;
  }
  
  client.status = newStatus;
  saveClients();
  refreshUI();
  console.log(`🔄 "${client.name}" → "${newStatus}"`);
}

function handleStatusSelectChange(event) {
  const select = event.target;
  const clientId = select.dataset.clientId;
  const newStatus = select.value;

  updateClientStatus(clientId, newStatus);
}

function initStatusSelects() {
  const selects = document.querySelectorAll(".status-select");
  selects.forEach(function (select) {
    select.addEventListener("change", handleStatusSelectChange);
  });
}

// =====================================================
// 8. Side panel and form
// =====================================================

function openPanel() {
  document.getElementById("sidePanel").classList.add("side-panel--visible");
  document.getElementById("overlay").classList.add("overlay--visible");
  document.getElementById("inputName").focus();
}

function closePanel() {
  document.getElementById("sidePanel").classList.remove("side-panel--visible");
  document.getElementById("overlay").classList.remove("overlay--visible");
  clearForm();
  clearAllErrors();
}

function clearForm() {
  document.getElementById("inputName").value = "";
  document.getElementById("inputCompany").value = "";
  document.getElementById("inputEmail").value = "";
  document.getElementById("inputStatus").value = "Nuevo";
  document.getElementById("inputPriority").value = "Media";
  document.getElementById("inputDate").value = "";
}

function readFormData() {
  return {
    name: document.getElementById("inputName").value.trim(),
    company: document.getElementById("inputCompany").value.trim(),
    email: document.getElementById("inputEmail").value.trim(),
    status: document.getElementById("inputStatus").value,
    priority: document.getElementById("inputPriority").value,
    lastContact: document.getElementById("inputDate").value,
  };
}

function isNotEmpty(value) {
  return value !== ""; 
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateFormData(formData) {
  let isValid = true; 

  if (!isNotEmpty(formData.name)) {
    showFieldError("errorName", "inputName");
    isValid = false;
  } else {
    clearError("errorName", "inputName");
  }

  if (!isNotEmpty(formData.company)) {
    showFieldError("errorCompany", "inputCompany");
    isValid = false;
  } else {
    clearError("errorCompany", "inputCompany");
  };

  if (!isNotEmpty(formData.email)) {
    showFieldError("errorEmail", "inputEmail", "El email es obligatorio");
    isValid = false;
  } else if (!isValidEmail(formData.email)) {
    showFieldError("errorEmail", "inputEmail", "Introduce un email válido (ej: ana@empresa.com)");
    isValid = false;
  } else {
    clearError("errorEmail", "inputEmail");
  }

  return isValid;
}


function createClientObject(formData) {
  return {
    id: Date.now(),  
    name: formData.name,
    company: formData.company,
    email: formData.email,
    status: formData.status,
    priority: formData.priority,
    lastContact: formData.lastContact,
  };
}

function handleSave() {
  const formData = readFormData();

  if (!validateFormData(formData)) {
    console.log("❌ Validación fallida. No se guarda.");
    return;
  }

  const newClient = createClientObject(formData);
  clients.push(newClient);
  saveClients();
  refreshUI();
  closePanel();
  console.log(`✅ Nuevo cliente guardado. Total: ${clients.length}`);
}


// =====================================================
// 9. Event initialization
// =====================================================

function setActiveTab(clickedTab) {
  document.querySelectorAll(".filter-tab").forEach(function (tab) {
    tab.classList.remove("filter-tab--active");
  });

  clickedTab.classList.add("filter-tab--active");
}

function handleTabClick(event) {
  const tab = event.currentTarget;
  const status = tab.dataset.status;

  filters.status = status;
  setActiveTab(tab);
  applyFilters();
}

function handleSearch(event) {
  filters.search = event.currentTarget.value.trim();
  applyFilters();
}


function handlePriorityChange(event) {
  filters.priority = event.currentTarget.value;
  applyFilters();
}

function initSearch() {
  const input = getSearchInput();

  if (!input) {
    console.error("❌ No se encontró el input de búsqueda.");
    return;
  }

  input.addEventListener("input", handleSearch);
}


function initStatusTabs() {
  const tabs = document.querySelectorAll(".filter-tab");

  if (tabs.length === 0) {
    console.error("No se encontraron tabs de filtro.");
    return;
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", handleTabClick);
  });
}

function initPrioritySelect() {
  const select = document.querySelector(".priority-select");

  if (!select) {
    console.error("❌ No se encontró el select de prioridad.");
    return;
  }

  select.addEventListener("change", handlePriorityChange);
}

function initPanel() {
  document.getElementById("btnOpenPanel").addEventListener("click", openPanel);
  document.getElementById("btnClosePanel").addEventListener("click", closePanel);
  document.getElementById("btnCancel").addEventListener("click", closePanel);
  document.getElementById("btnSave").addEventListener("click", handleSave);
  document.getElementById("overlay").addEventListener("click", closePanel);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closePanel();
  });
}

// Entry point: load persisted data, render the UI, then attach event listeners.
document.addEventListener("DOMContentLoaded", function () {
  loadClients(); 
  refreshUI();
  initSearch();
  initStatusTabs();
  initPrioritySelect();
  initPanel();
});