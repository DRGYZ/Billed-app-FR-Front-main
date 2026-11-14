import VerticalLayout from "./VerticalLayout.js";
import ErrorPage from "./ErrorPage.js";
import LoadingPage from "./LoadingPage.js";
import BigBilledIcon from "../assets/svg/big_billed.js";
import { filteredBills } from "../containers/Dashboard.js";
import ArrowIcon from "../assets/svg/arrow.js";
import { computeBillSummary, formatEuro, consumeFlash, escapeHtml } from "../app/format.js";

export default ({ data, loading, error }) => {
  if (loading) {
    return LoadingPage();
  }
  if (error) {
    return ErrorPage(error);
  }

  const allBills = data && data.bills ? data.bills : [];
  const pendingBills = filteredBills(allBills, "pending");
  const acceptedBills = filteredBills(allBills, "accepted");
  const refusedBills = filteredBills(allBills, "refused");
  const { sums } = computeBillSummary([...pendingBills, ...acceptedBills, ...refusedBills]);

  const adminFlash = consumeFlash("billed_admin_flash");
  const flashHtml = adminFlash
    ? `
      <div class="flash-banner ${adminFlash.status === "accepted" ? "flash-banner--ok" : "flash-banner--bad"}" role="status">
        <div>
          <strong>Décision enregistrée (${escapeHtml(adminFlash.statusLabel)}).</strong>
          « ${escapeHtml(adminFlash.name)} » (${formatEuro(adminFlash.amount)}) —
          ${pendingBills.length > 0 ? `il reste ${pendingBills.length} note${pendingBills.length > 1 ? "s" : ""} à traiter.` : "toute la file en attente est traitée."}
        </div>
      </div>
    `
    : "";

  return `
    <div class="layout">
      ${VerticalLayout(120)}
      <main class="dashboard-content">
        <div class="dashboard-topbar">
          <div>
            <h2 class="dashboard-page-title">Validations</h2>
            <p class="dashboard-page-sub">Contrôle des justificatifs et arbitrage des notes de frais</p>
          </div>
        </div>

        ${flashHtml}

        <div class="kpi-strip" aria-label="Synthèse de la file">
          <div class="kpi-card kpi-card--attention">
            <span class="kpi-label">À traiter en priorité</span>
            <span class="kpi-value num">${pendingBills.length} note${pendingBills.length > 1 ? "s" : ""}</span>
            <span class="kpi-meta">${formatEuro(sums.pending)}</span>
          </div>
          <div class="kpi-card kpi-card--ok">
            <span class="kpi-label">Validées</span>
            <span class="kpi-value num">${acceptedBills.length} note${acceptedBills.length > 1 ? "s" : ""}</span>
            <span class="kpi-meta">${formatEuro(sums.accepted)}</span>
          </div>
          <div class="kpi-card kpi-card--bad">
            <span class="kpi-label">Refusées</span>
            <span class="kpi-value num">${refusedBills.length} note${refusedBills.length > 1 ? "s" : ""}</span>
            <span class="kpi-meta">${formatEuro(sums.refused)}</span>
          </div>
        </div>

        <div class="dashboard-workbench">
          <section class="bills-feed" aria-label="File des notes de frais">
            <div class="status-bills-header" data-toggle-arrow="1">
              <h3> En attente (${pendingBills.length}) </h3>
              <span class="arrow-icon" id="arrow-icon1" data-testid="arrow-icon1">${ArrowIcon}</span>
            </div>
            <div class="status-bills-container" id="status-bills-container1"></div>

            <div class="status-bills-header" data-toggle-arrow="2">
              <h3> Validé (${acceptedBills.length}) </h3>
              <span class="arrow-icon" id="arrow-icon2" data-testid="arrow-icon2">${ArrowIcon}</span>
            </div>
            <div class="status-bills-container" id="status-bills-container2"></div>

            <div class="status-bills-header" data-toggle-arrow="3">
              <h3> Refusé (${refusedBills.length}) </h3>
              <span class="arrow-icon" id="arrow-icon3" data-testid="arrow-icon3">${ArrowIcon}</span>
            </div>
            <div class="status-bills-container" id="status-bills-container3"></div>
          </section>

          <section class="dashboard-right-container" aria-label="Contrôle de la note sélectionnée">
            <div class="dashboard-right-slot">
              <div class="dashboard-empty-state">
                <div id="big-billed-icon" data-testid="big-billed-icon"> ${BigBilledIcon} </div>
                <p>Sélectionnez une note dans la file pour examiner le justificatif et décider de sa validation ou de son refus.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  `;
};
