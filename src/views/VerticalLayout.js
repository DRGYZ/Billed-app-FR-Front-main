import WindowIcon from "../assets/svg/window.js";
import MailIcon from "../assets/svg/mail.js";
import DisconnectIcon from "../assets/svg/disconnect.js";
import { escapeHtml } from "../app/format.js";

const BRAND_ICON = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 2.5h10v11l-2-1.2-1.5 1.2-1.5-1.2-1.5 1.2-1.5-1.2-2 1.2v-11z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M5.5 6h5M5.5 8.5h3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
`;

export default (height) => {
  let user = JSON.parse(localStorage.getItem("user"));
  if (typeof user === "string") {
    user = JSON.parse(user);
  }
  const email = user?.email ? `<span class="rail-user-email mono">${escapeHtml(user.email)}</span>` : "";

  if (user && user.type === "Employee") {
    return `
      <aside class="vertical-navbar" style="height: ${height}vh;" aria-label="Navigation employé">
        <div class="rail-top">
          <div class="rail-header-row">
            <div class="rail-brand">
              <span class="brand-mark-badge">${BRAND_ICON}</span>
              <span class="layout-title">Billed</span>
            </div>
            <span class="rail-role-chip">Espace Employé</span>
          </div>
          <nav class="rail-nav" aria-label="Menu employé">
            <button type="button" id="layout-icon1" data-testid="icon-window" class="rail-nav-item">
              ${WindowIcon}
              <span>Mes notes</span>
            </button>
            <button type="button" id="layout-icon2" data-testid="icon-mail" class="rail-nav-item">
              ${MailIcon}
              <span>Nouvelle note</span>
            </button>
          </nav>
        </div>
        <div class="rail-footer">
          ${email}
          <button type="button" id="layout-disconnect" data-testid="layout-disconnect" class="rail-disconnect-btn">
            ${DisconnectIcon}
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    `;
  }

  return `
    <aside class="vertical-navbar" style="height: ${height}vh;" aria-label="Navigation administration">
      <div class="rail-top">
        <div class="rail-header-row">
          <div class="rail-brand">
            <span class="brand-mark-badge">${BRAND_ICON}</span>
            <span class="layout-title">Billed</span>
          </div>
          <span class="rail-role-chip">Administration RH</span>
        </div>
        <nav class="rail-nav" aria-label="Menu administration">
          <div class="rail-nav-item active-icon">
            ${WindowIcon}
            <span>Contrôle des notes</span>
          </div>
        </nav>
      </div>
      <div class="rail-footer">
        ${email}
        <button type="button" id="layout-disconnect" data-testid="layout-disconnect" class="rail-disconnect-btn">
          ${DisconnectIcon}
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  `;
};
