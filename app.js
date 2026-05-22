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

//RENDERIZADO DE TABLA
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

//FUNCIONES DE CÁLCULO DE MÉTRICAS
//Cada función recibe el array completo y devuelve un número.
//===========================================================

//Cuenta el total de clientes en el array
function countTotal(clientList) {
  return clientList.length;
}

//Cuenta cuántos clientes tienen un status concreto
function countByStatus(clientList, status) {
  return clientList.filter(function (client) {
    return client.status === status;
  }).length;
}

//Calcula el porcentaje de clientes cerrados sobre el total
function calcCerradosPct(clientList) {
  const total = clientList.length;
  const cerrados = countByStatus(clientList, "Cerrado");

  if (total === 0) return 0;
  return Math.round((cerrados / total) * 100);
}

//FUNCIONES DE ACTUALIZACIÓN DEL DOM  
//Escriben los valores calculados en los elementos HTML correspondientes.
//=======================================================================

//Ayudante: busca un elemento por id y cambia su texto
function setMetricValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

//Ayudante: actualiza el pie de una tarjeta
function setMetricFooter(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

//Actualiza las 3 tarjetas dinámicas con los datos del array
function updateMetrics(clientList) {

  //Tarjeta1: Total clientes
  const total = countTotal(clientList);
  setMetricValue("metric-total", total);
  setMetricFooter("metric-total-footer", `${total} clientes en total`);


  //Tarjeta 3: Clientes nuevos
  //Contamos los que tienen status "Nuevo"
  const nuevos = countByStatus(clientList, "Nuevo");
  setMetricValue("metric-nuevos", nuevos);
  setMetricFooter("metric-nuevos-footer", `De ${total} clientes totales`);

  //Tarjeta 4: Clientes cerrados (%)
  //Mostramos el porcentaje de cierres sobre el total
  const pct = calcCerradosPct(clientList);
  setMetricValue("metric-cerrados", pct + "%");
  setMetricFooter("metric-cerrados-footer", `${countByStatus(clientList, "Cerrado")} cierres sobre ${total}`);

}

//Función getSearchInput
//Obtiene la referencia al campo de búsqueda del html
function getSearchInput() {
  return document.querySelector(".search-input");
}

//FUNCIONDES DE FILTRADO
//==============================================
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

  return clientList.filter(function (client) {
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

//FORMULARRIO: ABRIR Y CERRAR
//================================

//Abre el panel lateral y el overlay
//Solo añade clases CSS
function openPanel() {
  document.getElementById("sidePanel").classList.add("side-panel--visible");
  document.getElementById("overlay").classList.add("overlay--visible");
  //Ponemos el foco en el primer campo para mejorar UX
  document.getElementById("inputName").focus();
}

//Cierra el panel y limpia el formulario
function closePanel() {
  document.getElementById("sidePanel").classList.remove("side-panel--visible");
  document.getElementById("overlay").classList.remove("overlay--visible");
  clearForm();
}

//Vacía todos los campos del formulario
//Se llama al cerrar para que la proxima apertura esté limpia
function clearForm() {
  document.getElementById("inputName").value = "";
  document.getElementById("inputCompany").value = "";
  document.getElementById("inputEmail").value = "";
  document.getElementById("inputStatus").value = "";
  document.getElementById("inputPriority").value = "";
  document.getElementById("inputDate").value = "";
}

//FORMULARIO: LEER, CREAR Y GUARDAR

//Lee los valores de los 6 campos y los devuelve en un objeto
//No valida ni guarda, solo lee
function readFormData() {
  return {
    name: document.getElementById("inputName").value.trim(),
    company: document.getElementById("inputComapany").value.trim(),
    email: document.getElementById("inputEmail").value.trim(),
    status: document.getElementById("inputStatus").value,
    priority: document.getElementById("inputPriority").value,
    lastContact: document.getElementById("inputDate").value,
  };
}

//Crea un obejto completo a partir de los datos del formulario
//Genera un id único basándose en el timestamp actual (Date.now())
//Así cada cliente tendrá un id diferente aunque se creen muy seguido
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

//Validación básica: comprueba que los campos obligatorios no estén vacíos
//Devuelve true si todo está bien, false si falta algo
function isFormValid(formData) {
  return (
    formData.name !== "" &&
    formData.company !== "" &&
    formData.email !== "" &&
    formData.lastContact !== "" 
  );
}

//Función principal del formulario: une todos los pasos
//Lee, valida, crea obejto, aãnde al array, actualiza UI, cierra
function handleSave() {
  //Paso 1: leer los datos del formulario
  const formData = readFormData;

  //Paso 2: validación básica
  if (!isFormValid(formData)) {
    alert("Please complete at least: name, company, email, and date.");
    return; 
  }

  //Paso 3: crear el objeto cliente con todos sus campos
  const newClient = createClientObject(formData);

  //Paso 4: añadir el nuevo cliente al array original
  //.push() añade un elemento al final del array
  clients.push(newClient);

  //Paso 5: actualizar la UI completa
  updateMetrics(clients);
  applyFilters();

  //Paso 6: cerrar el panel y limpiar el formulario
  closePanel();
}


//MANEJADORES DE EVENTOS
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

//INICIALIZACIÓN
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
  const select = getPrioritySelect();
  if (!select) {
    console.error("❌ No se encontró el select de prioridad.");
    return;
  }

  select.addEventListener("change", handlePriorityChange);
}

//Conecta todos los botones relacionados con el panel
function initPanel() {
  //Botón "Nuevo Cliente" del header > abre el panel
  document.getElementById("btnOpenPanel").addEventListener("click", openPanel);

  //Botón X del panel > cierra
  document.getElementById("btnClosePanel").addEventListener("click", closePanel);

  //Botón "Cancelar" > cierra
  document.getElementById("btnCancel").addEventListener("click", closePanel);

  //Botón "Guardar Cliente" > ejecuta el flujo completo
  document.getElementById("btnSave").addEventListener("click", handleSave);

  //Clic en el overlay (fondo oscuro) > cierra el panel
  document.getElementById("overlay").addEventListener("click", closePanel);

  //Tecla Escape > cierra el panel (comportamiento estándar de modales)
  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") closePanel();
  });

}

// Arranque
document.addEventListener("DOMContentLoaded", function () {
  updateMetrics(clients); //Calcula y pinta las métricas con todos los datos
  renderClients(clients); //Pinta la tabla completa
  initSearch();
  initStatusTabs();
  initPrioritySelect();
  initPanel();
});