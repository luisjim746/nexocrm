// =====================================================
// Lógica de renderizado de clientes en la tabla
// Estructura de columnas:
// Cliente | Contacto | Estado | Prioridad | Último contacto | Acciones
// =====================================================

// Mapa de clases CSS para estados
const STATUS_CLASS = {
  Nuevo: "status--prospect",
  Contactado: "status--active",
  "En proceso": "status--inactive",
  Cerrado: "status--active",
  Perdido: "status--at-risk",
};

// Mapa de clases CSS para prioridades
const PRIORITY_CLASS = {
  Alta: "status--at-risk",
  Media: "status--prospect",
  Baja: "status--inactive",
};

// Colores de avatar reutilizables
const AVATAR_COLORS = ["avatar--a", "avatar--b", "avatar--c", "avatar--d", "avatar--e"];

//Estado compartido de filtros
let activeStatus = "all";
let activeSearch = "";
let activePriority = "all";


// Obtiene el tbody de la tabla
function getTableBody() {
  return document.querySelector(".data-table tbody");
}

// Genera iniciales a partir del nombre
function getInitials(fullName) {
  return fullName
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

// Devuelve una clase de color según la posición
function getAvatarColor(index) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

// Formatea fecha ISO a formato legible
function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Crea un badge reutilizable
function createBadge(text, classMap) {
  const cssClass = classMap[text] || "status--inactive";
  return `<span class="status-badge ${cssClass}">${text}</span>`;
}

// Crea una fila completa de cliente
function createClientRow(client, index) {
  const initials = getInitials(client.name);
  const avatarColor = getAvatarColor(index);
  const statusBadge = createBadge(client.status, STATUS_CLASS);
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

      <td>${statusBadge}</td>

      <td>${priorityBadge}</td>

      <td class="cell-muted">${dateText}</td>

      <td>
        <button class="row-action-btn">Ver →</button>
      </td>
    </tr>
  `;
}

// Renderiza todos los clientes en la tabla
function renderClients(clientList) {
  const tbody = getTableBody();

  if (!tbody) {
    console.error("No se encontró el tbody de la tabla.");
    return;
  }

  const rowsHTML = clientList.map((client, index) => {
    return createClientRow(client, index);
  });

  tbody.innerHTML = rowsHTML.join("");
}

//Función getSearchInput
//Obtiene la referencia al campo de búsqueda del html
function getSearchInput() {
  return document.querySelector(".search-input");
}

//Función para normalizar
//Convierte texto a minúsculas y elimina tildes
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

//Función filterClients
//Devuelve solo los clientes que coinciden con el texto buscado en name o company
function filterBySearch(clientList, searchText) {
  if (searchText === "") {
    return clientList;
  }

  const query = normalizeText(searchText);
  return clientList.filter(function (client) {
    const clientName = normalizeText(client.name);
    const clientCompany = normalizeText(client.company);

    return clientName.includes(query) || clientCompany.includes(query);
  });
}

//Función que filtra por estado
function filterByStatus(clientList, status) {
  if (status === "all") {
    return clientList;
  }

  return clientList.filter(function (client) {
    return client.status === status;
  });
}

//Función que filtra por prioridad
function filterByPriority(clientList, priority) {
  if (priority === "all") {
    return clientList;
  }

  return clientList.filter(function(client) {
    return client.priority === priority;
  });
}

//Aplica ambos filtros juntos
function applyFilters() {
  let result = clients;

  result = filterByStatus(result, activeStatus);
  result = filterByPriority(result, activePriority);
  result = filterBySearch(result, activeSearch);

  renderClients(result);

}

//Cambia el estilo visual del tab activo
function setActiveTab(clickedTab) {
  document.querySelectorAll(".filter-tab").forEach(function (tab) {
    tab.classList.remove("filter-tab--active");
  });

  clickedTab.classList.add("filter-tab--active");
}

//Maneja el click en tabs de estado
function handleTabClick(event) {
  const tab = event.currentTarget;
  const status = tab.dataset.status;

  activeStatus = status;
  setActiveTab(tab);
  applyFilters();
}

//Función handleSearch
//Se ejecuta cada vez que el usuario escribe
//Ahora guarda el texto y aplica ambos filtros
function handleSearch() {
  activeSearch = getSearchInput().value.trim();
  applyFilters();
}

function getPrioritySelect() {
  return document.querySelector(".priority-select");
}

function handlePriorityChange() {
  activePriority = getPrioritySelect().value;
  applyFilters();
}

//Función initSearch
//Conecta el input de búsqueda con la función handleSearch
//Esto hace lo de "filtrar mientras escribes"
function initSearch() {
  const input = getSearchInput();

  if (!input) {
    console.error("❌ No se encontró el input de búsqueda.");
    return;
  }

  //Cada vez que el usuario escriba una letra, ejecutamos handleSearch
  input.addEventListener("input", handleSearch);
}

//Inicializa los tabs de estado
function initStatusTabs () {
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
  const select = getPrioritySelect();
  if (!select) { console.error("❌ No se encontró el select de prioridad."); 
    return;
  }

  select.addEventListener("change", handlePriorityChange);
}


// Arranque
document.addEventListener("DOMContentLoaded", function () {
  renderClients(clients);
  initSearch();
  initStatusTabs();
  initPrioritySelect();
});