// =====================================================
// Lógica de renderizado de clientes en la tabla
// Estructura de columnas:
// Cliente | Contacto | Estado | Prioridad | Último contacto | Acciones
// =====================================================

//CONSTANTES Y ESTADO COMPARTIDO
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

//Estados disponibles para el select inline de cada fila
const STATUS_OPTIONS = ["Nuevo", "Contactado", "En proceso", "Cerrado", "Perdido"];

//Clave con la que guardamos en localStorage
const STORAGE_KEY = "crm_clients";

//Estado compartido de filtros
let activeStatus = "all";
let activeSearch = "";
let activePriority = "all";

//PERSISTENCIA CON LOCALSTORAGE
//JSON.stringify() > convierte el array a string para Guardar
//JSON.parse() > convierte el string  de vuelta a array para Leer
function saveClients() {
  const clientsAsString = JSON.stringify(clients);
  localStorage.setItem(STORAGE_KEY, clientsAsString);
  console.log(`💾 Guardados ${clients.length} clientes en localStorage.`);
}

function loadClients() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    //Había datos guardados: los parseamos y reemplazamos el array
    const parsed = JSON.parse(stored);
    //clients.length = 0 vacía el array sin crear uno nuevo
    clients.length = 0;
    parsed.forEach(function(c) { clients.push(c);});
    console.log(`📂 ${clients.length} clientes cargados desde localStorage.`);
  } else {
    //No había datos: usamos los mocks de data.js
    console.log("📂 Sin datos guardados. Usando datos mock iniciales.");
  }
}


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

//En vez de un badge estático, genera un <select> con todos los estados posibles.
function createStatusSelect(client) {
  //Generamos una <option> por cada estado posible
  //Si el estado coincide con el actual, lo marcamos como selected
  const options = STATUS_OPTIONS.map(function(status) {
    const isSelected = status === client.status ? "selected" : "";
    return `<option value="${status}" ${isSelected}>${status}</option>`;
  }).join("");

  //El select lleva el id del cliente en data-client-id
  //Y la clase status-select para que JS pueda encontrarlo
  return `
    <select
      class="status-select ${STATUS_CLASS[client.status] || "status--inactive"}"
      data-client-id="${client.id}"
    >
      ${options}
    </select>
  `;
}

// Crea una fila completa de cliente
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

  //Después de renderizar, conectamos los eventos del select
  //Hay que hacerlo aquí porque los <select> acaban de crearse
  initStatusSelects();
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
  if (searchText === "") return clientList;
  
  const query = normalizeText(searchText);
  return clientList.filter(function (client) {
    const clientName = normalizeText(client.name);
    const clientCompany = normalizeText(client.company);

    return clientName.includes(query) || clientCompany.includes(query);
  });
}

//Función que filtra por estado
function filterByStatus(clientList, status) {
  if (status === "all") return clientList;

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

//ACTUALIZAR ESTADO DE UN CLIENTE
//Modificar una propiedad de un objeto dentro del array
//findClientById busca en el array global clients 

function findClientById(id) {
  return clients.find(function(client) {
    //Comparamos con == en vez de === porque el id del
    //dataset siempre llega como string ("1", "2"...)
    //y en el array puede ser número. == ignora el tipo.
    return client.id == id;
  });
}

//updateClientStatus recibe el id del cliente y el nuevo estado,
//encuentra el objeto en el array y modifica su propiedad status directamente
function updateClientStatus(clientId, newStatus) {
  //Paso 1: encontrar el objeto clients en el array
  const client = findClientById(clientId);
  if (!client) {
    console.error("❌ Cliente no encontrado:", clientId);
    return;
  }

  //Paso 2: guardar el estado anterior (útil para el log)
  const previousStatus = client.status;

  //Paso 3: modificar la propiedad directamente
  client.status = newStatus;

  //Guardamos después de cada cambio de estado
  saveClients();

  //Paso 4: actualizar las métricas (cambia el conteo de estados)
  updateMetrics(clients);

  //Paso 5: re-renderizar la tabla respetando los filtros activos
  applyFilters();
}

//handleStatusSelectChange
//Manejador del evento "change" de cada select.
//Lee el id del cliente y el nuevo estado elegido, y llama a updateClientStatus
function handleStatusSelectChange(event) {
  //event.target es el <select> que cambió
  const select = event.target;

  //Leemos los dos datos que necesitamos del propio elemento del propio elemento HTML
  const clientId = select.dataset.clientId;
  const newStatus = select.value;
  updateClientStatus(clientId, newStatus);
}

//initStatusSelects conecta el evento "change" a cada select de estado que existe
function initStatusSelects() {
  const selects = document.querySelectorAll(".status-select");

  selects.forEach(function(select) {
    select.addEventListener("change", handleStatusSelectChange);
  });
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
  clearAllErrors();
}

//Vacía todos los campos del formulario
//Se llama al cerrar para que la proxima apertura esté limpia
function clearForm() {
  document.getElementById("inputName").value = "";
  document.getElementById("inputCompany").value = "";
  document.getElementById("inputEmail").value = "";
  document.getElementById("inputStatus").value = "Nuevo";
  document.getElementById("inputPriority").value = "Media";
  document.getElementById("inputDate").value = "";
}

//FORMULARIO: LEER, CREAR Y GUARDAR
//CAPTURA DE DATOS

//Lee los valores de los 6 campos y los devuelve en un objeto
//No valida ni guarda, solo lee
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

//VALIDACIÓN DE DATOS
//Comprobar que los datos capturados cumplen las reglas del negocio

//Regla 1: el campo no puede estar vacío
function isNotEmpty (value) {
  return value !== ""; //true si tiene contenido, false si está vacío
}

//Regla 2: el email debe tener formato básico
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email); //.test aplica la regla regex al email y devulve true o false
}


//MOSTRAR Y OCULTAR ERRORES EN EL DOM
function showError(errorId, inputId, message) {
  const errorEl = document.getElementById(errorId);
  const inputEl = document.getElementById(inputId);

  if (errorEl) {
    //Si nos pasan un mensaje, lo usamos; si no, mantenemos el del HTML
    if (message) errorEl.textContent = message;
    errorEl.style.display = "block"; //Hace visible el span oculto
   }

  if (inputEl) {
    inputEl.classList.add("form-input--error");
  } 
}

//Oculta el mensaje de error y elimina el borde rojo
function clearError(errorId, inputId) {
  const errorEl = document.getElementById(errorId);
  const inputEl = document.getElementById(inputId);

  if (errorEl) errorEl.style.display = "none";
  if (inputEl) inputEl.classList.remove("form-input--error");
}

//Limpia todos los errores del formulario de una vez
//Se llama al cerrar el panel para dejarlo limpio
function clearAllErrors() {
  clearError("errorName", "inputName");
  clearError("errorCompany", "inputCompany");
  clearError("errorEmail", "inputEmail");
}

//Ejecuta todas las validaciones juntas.
function validateFormData(formData) {
  let isValid = true; //Emepezamos asumiendo que todo está bien

  if (!isNotEmpty(formData.name)) {
    showError("errorName", "inputName");
    isValid = false;
  } else {
    clearError("errorName", "inputName");
  }

  if (!isNotEmpty(formData.company)) {
    showError("errorCompany", "inputCompany");
    isValid = false;
  } else {
    clearError("errorCompany", "inputCompany");
  };

  //Validar email, comprobamos que no esté vacío y el formato.
  if (!isNotEmpty(formData.email)) {
    showError("errorEmail", "inputEmail", "El email es obligatorio");
    isValid = false;
  } else if (!isValidEmail(formData.email)) {
    showError("errorEmail", "inputEmail", "Introduce un email válido (ej: ana@empresa.com)");
    isValid = false;
  } else {
    clearError("errorEmail", "inputEmail");
  }

  return isValid;
}

//GUARDAR DATOS 
//Crea un objeto completo a partir de los datos del formulario
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

//Función principal del formulario: une todos los pasos
//Lee, valida, crea obejto, aãnde al array, actualiza UI, cierra
function handleSave() {
  const formData = readFormData();

  const isValid = validateFormData(formData);
  if (!isValid) {
    console.log("❌ Validación fallida. No se guarda.");
    return;
  }

  //Paso 3: crear el objeto cliente con todos sus campos
  const newClient = createClientObject(formData);

  //Paso 4: añadir el nuevo cliente al array original
  //.push() añade un elemento al final del array
  clients.push(newClient);

  //Guardamos después de añadir el nuevo cliente
  saveClients();

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
  loadClients();  //Primero: cargar datos persistidos o mock
  updateMetrics(clients); //Calcula y pinta las métricas con todos los datos
  renderClients(clients); //Pinta la tabla completa
  initSearch();
  initStatusTabs();
  initPrioritySelect();
  initPanel();
});