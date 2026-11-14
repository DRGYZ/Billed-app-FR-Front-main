import VerticalLayout from "./VerticalLayout.js";
import ErrorPage from "./ErrorPage.js";
import LoadingPage from "./LoadingPage.js";
import Actions from "./Actions.js";
import {
  escapeHtml,
  getStatusMeta,
  formatEuro,
  computeBillSummary,
  consumeFlash,
} from "../app/format.js";

const row = (bill) => {
  const meta = getStatusMeta(bill.status);
  return `
    <tr data-status="${escapeHtml(bill.status || "pending")}">
      <td class="bill-type-cell">${escapeHtml(bill.type)}</td>
      <td class="bill-name-cell">${escapeHtml(bill.name || "Note de frais")}</td>
      <td class="bill-date-cell">${escapeHtml(bill.date)}</td>
      <td class="bill-amount-cell">${escapeHtml(bill.amount)} €</td>
      <td class="bill-status-cell">
        <span class="status-pill ${meta.modifier}">
          <span class="status-dot" aria-hidden="true"></span>${meta.label}
        </span>
      </td>
      <td class="bill-actions-cell">
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
  `;
};

const rows = (data) => {
  if (!data || !data.length) {
    return `
      <tr>
        <td colspan="6" class="bills-empty-cell">
          Aucune note de frais enregistrée pour le moment. Utilisez « Nouvelle note de frais » pour envoyer un justificatif.
        </td>
      </tr>
    `;
  }
  return data.map((bill) => row(bill)).join("");
};

export default ({ data: bills, loading, error }) => {
  const modal = () => `
    <div class="modal fade" id="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Fermer">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body"></div>
        </div>
      </div>
    </div>
  `;

  if (loading) return LoadingPage();
  if (error) return ErrorPage(error);

  const sortedBills = (bills || []).slice().sort((a, b) => {
    const ta = Date.parse(a.date);
    const tb = Date.parse(b.date);
    if (Number.isNaN(ta) && Number.isNaN(tb)) return 0;
    if (Number.isNaN(ta)) return 1;
    if (Number.isNaN(tb)) return -1;
    return tb - ta;
  });

  const { counts, sums } = computeBillSummary(sortedBills);
  const flash = consumeFlash("billed_flash");
  const flashHtml = flash
    ? `
      <div class="flash-banner flash-banner--ok" role="status">
        <div>
          <strong>Note transmise à l’administration.</strong>
          « ${escapeHtml(flash.name)} » (${formatEuro(flash.amount)}) est maintenant suivie dans votre historique ci-dessous.
        </div>
      </div>
    `
    : "";

  return `
    <div class="layout">
      ${VerticalLayout(120)}
      <main class="content">
        <div class="content-header">
          <div class="content-header-text">
            <h1 class="content-title">Mes notes de frais</h1>
            <p class="content-subtitle">Suivi des notes envoyées et vérification des remboursements</p>
          </div>
          <button type="button" id="btn-new-bill" data-testid="btn-new-bill" class="btn btn-primary">
            Nouvelle note de frais
          </button>
        </div>

        ${flashHtml}

        <div class="kpi-strip" aria-label="Synthèse de vos notes">
          <div class="kpi-card kpi-card--attention">
            <span class="kpi-label">En attente de contrôle</span>
            <span class="kpi-value num">${counts.pending} note${counts.pending > 1 ? "s" : ""}</span>
            <span class="kpi-meta">${formatEuro(sums.pending)}</span>
          </div>
          <div class="kpi-card kpi-card--ok">
            <span class="kpi-label">Remboursements validés</span>
            <span class="kpi-value num">${counts.accepted} note${counts.accepted > 1 ? "s" : ""}</span>
            <span class="kpi-meta">${formatEuro(sums.accepted)}</span>
          </div>
          <div class="kpi-card kpi-card--bad">
            <span class="kpi-label">Notes refusées</span>
            <span class="kpi-value num">${counts.refused} note${counts.refused > 1 ? "s" : ""}</span>
            <span class="kpi-meta">${formatEuro(sums.refused)}</span>
          </div>
        </div>

        <div id="data-table">
          <table id="example" class="table table-striped bills-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody data-testid="tbody">
              ${rows(sortedBills)}
            </tbody>
          </table>
        </div>
      </main>
      ${modal()}
    </div>
  `;
};
