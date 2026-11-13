import eyeWhite from "../assets/svg/eye_white.js";
import { formatDate, escapeHtml, getStatusMeta, formatEmployeeName } from "../app/format.js";

export const modal = () => `
  <div class="modal fade" id="modaleFileAdmin1" data-testid="modaleFileAdmin" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Fermer">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" data-toggle="modal"></div>
      </div>
    </div>
  </div>
`;

export default (bill) => {
  const status = getStatusMeta(bill.status);
  const employeeName = formatEmployeeName(bill);
  const commentaryText = bill.commentary ? escapeHtml(bill.commentary) : "Aucun commentaire saisi";
  const adminCommentText = bill.commentAdmin
    ? escapeHtml(bill.commentAdmin)
    : "Décision enregistrée sans commentaire.";
  const safeFileUrl = escapeHtml(bill.fileUrl || "");
  const safeFileName = escapeHtml(bill.fileName || "justificatif.jpg");

  return `
    <div class="container dashboard-form" data-testid="dashboard-form">
      <header class="inspector-header">
        <div>
          <h3 class="inspector-title">${escapeHtml(bill.name)}</h3>
          <div class="inspector-who">
            ${escapeHtml(employeeName)} · <span class="mono">${escapeHtml(bill.email || "")}</span>
          </div>
        </div>
        <span class="status-pill ${status.modifier}">
          <span class="status-dot" aria-hidden="true"></span>${status.label}
        </span>
      </header>

      <div class="inspector-split">
        <div class="inspector-left">
          <div class="data-grid">
            <div class="data-cell">
              <span class="data-cell-label">Type de dépense</span>
              <div class="data-cell-value">${escapeHtml(bill.type)}</div>
            </div>
            <div class="data-cell">
              <span class="data-cell-label">Date</span>
              <div class="data-cell-value mono">${escapeHtml(formatDate(bill.date))}</div>
            </div>
            <div class="data-cell">
              <span class="data-cell-label">Montant TTC</span>
              <div class="data-cell-value mono"><span data-testid="amount-d">${escapeHtml(bill.amount)}</span><span>&nbsp;€</span></div>
            </div>
            <div class="data-cell">
              <span class="data-cell-label">TVA déclarée</span>
              <div class="data-cell-value mono">
                <span>${escapeHtml(
                  bill.vat !== undefined && bill.vat !== null && String(bill.vat).trim() !== ""
                    ? bill.vat
                    : "0"
                )}</span><span>&nbsp;€</span>
                <span>&nbsp;(</span><span>${escapeHtml(bill.pct ?? 20)}</span><span>&nbsp;%)</span>
              </div>
            </div>
          </div>

          <div class="data-cell">
            <span class="data-cell-label">Commentaire employé</span>
            <div class="data-cell-value" style="font-weight: 500;">${commentaryText}</div>
          </div>

          ${
            bill.status === "pending"
              ? `
                <div class="newbill-field">
                  <label for="commentary2" class="bold-label">Ajouter un commentaire</label>
                  <div class="quick-chips" role="group" aria-label="Motifs fréquents">
                    <button type="button" class="quick-chip" data-quick-note="Justificatif conforme, remboursement validé.">Justificatif conforme</button>
                    <button type="button" class="quick-chip" data-quick-note="Plafond dépassé, justificatif complémentaire requis.">Plafond dépassé</button>
                    <button type="button" class="quick-chip" data-quick-note="Reçu illisible ou incomplet, merci de renvoyer la photo.">Reçu illisible</button>
                  </div>
                  <textarea id="commentary2" class="form-control" data-testid="commentary2" rows="4" placeholder="Précisez le motif en cas de refus ou ajoutez une note comptable..."></textarea>
                </div>

                <div class="buttons-flex">
                  <button type="submit" id="btn-refuse-bill" data-testid="btn-refuse-bill-d" class="btn">Refuser</button>
                  <button type="submit" id="btn-accept-bill" data-testid="btn-accept-bill-d" class="btn">Accepter</button>
                </div>
              `
              : `
                <div class="data-cell">
                  <span class="data-cell-label">Votre commentaire</span>
                  <div class="data-cell-value" style="font-weight: 500;">${adminCommentText}</div>
                </div>
              `
          }
        </div>

        <aside class="receipt-desk" aria-label="Justificatif joint">
          <div class="receipt-desk-head">
            <span id="file-name-admin" class="receipt-filename" title="${safeFileName}">${safeFileName}</span>
            <button
              type="button"
              id="icon-eye-d"
              data-testid="icon-eye-d"
              data-bill-url="${safeFileUrl}"
            >
              ${eyeWhite}
              <span>Agrandir</span>
            </button>
          </div>

          <div class="receipt-frame">
            <img class="receipt-photo" src="${safeFileUrl}" alt="Aperçu du justificatif" />
          </div>

          <div class="receipt-checks">
            <div class="receipt-check-item">
              <span class="check-dot" aria-hidden="true">✓</span>
              <span>Pièce jointe rattachée au dossier</span>
            </div>
            <div class="receipt-check-item">
              <span class="check-dot" aria-hidden="true">✓</span>
              <span>Montant et TVA prêts au contrôle</span>
            </div>
          </div>
        </aside>
      </div>
      ${modal()}
    </div>
  `;
};
