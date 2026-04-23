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

// Arranque
document.addEventListener("DOMContentLoaded", function () {
  renderClients(clients);
});