import VerticalLayout from "./VerticalLayout.js";

export default () => {
  return `
    <div class="layout">
      ${VerticalLayout(120)}
      <main class="content">
        <div class="content-header newbill-head-inline">
          <div class="content-header-text">
            <h1 class="content-title">Envoyer une note de frais</h1>
            <p class="content-subtitle">Joignez un justificatif lisible (JPG ou PNG) pour validation comptable.</p>
          </div>
          <button type="button" id="btn-cancel-bill" class="btn-ledger-ghost">
            Retour
          </button>
        </div>

        <div class="form-newbill-container content-inner">
          <form data-testid="form-new-bill">
            <div class="newbill-grid">
              <div class="newbill-col">
                <div class="newbill-field">
                  <label for="expense-type" class="bold-label">Type de dépense</label>
                  <select required id="expense-type" class="form-control newbill-control" data-testid="expense-type">
                    <option>Transports</option>
                    <option>Restaurants et bars</option>
                    <option>Hôtel et logement</option>
                    <option>Services en ligne</option>
                    <option>IT et électronique</option>
                    <option>Equipement et matériel</option>
                    <option>Fournitures de bureau</option>
                  </select>
                </div>

                <div class="newbill-field">
                  <label for="expense-name" class="bold-label">Nom de la dépense</label>
                  <input type="text" id="expense-name" class="form-control newbill-control" data-testid="expense-name" placeholder="Ex. Taxi Gare Part-Dieu" />
                </div>

                <div class="newbill-field">
                  <label for="datepicker" class="bold-label">Date</label>
                  <input required type="date" id="datepicker" class="form-control newbill-control mono" data-testid="datepicker" />
                </div>

                <div class="newbill-field">
                  <label for="amount" class="bold-label">Montant TTC (€)</label>
                  <input required type="number" id="amount" class="form-control newbill-control mono" data-testid="amount" placeholder="64" />
                </div>

                <div class="newbill-vat-row">
                  <div class="newbill-field">
                    <label for="vat" class="bold-label">TVA (€)</label>
                    <input type="number" id="vat" class="form-control newbill-control mono" data-testid="vat" placeholder="10.67" step="any" />
                  </div>
                  <div class="newbill-field">
                    <label for="pct" class="bold-label">Taux TVA (%)</label>
                    <input required type="number" id="pct" class="form-control newbill-control mono" data-testid="pct" placeholder="20" />
                  </div>
                </div>
              </div>

              <div class="newbill-col">
                <div class="newbill-field">
                  <label for="file" class="bold-label">Justificatif (.jpg, .jpeg, .png)</label>
                  <div class="receipt-dropzone">
                    <input
                      required
                      type="file"
                      id="file"
                      class="form-control newbill-control"
                      data-testid="file"
                      accept=".jpg,.jpeg,.png"
                      aria-describedby="file-error"
                    />
                    <p class="receipt-drop-hint">Seules les images JPG, JPEG ou PNG sont transmises au contrôle RH.</p>
                    <div id="receipt-preview-card" class="receipt-preview-card" hidden>
                      <img id="receipt-preview-img" class="receipt-preview-thumb" src="" alt="Aperçu du justificatif" />
                      <div>
                        <div id="receipt-preview-name" class="receipt-preview-title"></div>
                        <div class="receipt-preview-sub">Justificatif importé · Prêt pour l’envoi</div>
                      </div>
                    </div>
                  </div>
                  <span id="file-error" data-testid="file-error" class="error" role="alert"></span>
                </div>

                <div class="newbill-field">
                  <label for="commentary" class="bold-label">Commentaire pour l’administration</label>
                  <textarea id="commentary" class="form-control newbill-control" data-testid="commentary" rows="4" placeholder="Motif du déplacement ou précision utile pour la validation..."></textarea>
                </div>
              </div>
            </div>

            <div class="newbill-actions">
              <p data-testid="save-error" class="text-danger mb-0" role="alert"></p>
              <button type="submit" id="btn-send-bill" class="btn btn-primary">Envoyer la note</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  `;
};
