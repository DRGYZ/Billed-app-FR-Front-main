import eyeBlueIcon from "../assets/svg/eye_blue.js";
import { escapeHtml } from "../app/format.js";

export default (billUrl) => {
  const safeUrl = escapeHtml(billUrl || "");
  return `<div class="icon-actions">
    <div id="eye" data-testid="icon-eye" data-bill-url="${safeUrl}" role="button" tabindex="0" aria-label="Voir le justificatif">
      ${eyeBlueIcon}
      <span>Voir le reçu</span>
    </div>
  </div>`;
};
