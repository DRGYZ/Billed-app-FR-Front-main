import { ROUTES_PATH } from "../constants/routes.js";
import { escapeHtml } from "../app/format.js";
import Logout from "./Logout.js";

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;

    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`);
    if (buttonNewBill) {
      buttonNewBill.addEventListener("click", this.handleClickNewBill);
    }

    const navNewBill = document.getElementById("layout-icon2");
    if (navNewBill) {
      navNewBill.addEventListener("click", this.handleClickNewBill);
    }

    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);
    if (iconEye) {
      iconEye.forEach((icon) => {
        icon.addEventListener("click", () => this.handleClickIconEye(icon));
        icon.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            this.handleClickIconEye(icon);
          }
        });
      });
    }

    new Logout({ document, localStorage, onNavigate });
  }

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH["NewBill"]);
  };

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url") || "";
    const modalWidth = $("#modaleFile").width() || 560;
    const imgWidth = Math.max(240, Math.floor(modalWidth * 0.5));
    $("#modaleFile")
      .find(".modal-body")
      .html(
        `<div class="bill-proof-container"><img width="${imgWidth}" src="${escapeHtml(billUrl)}" alt="Bill" /></div>`
      );
    $("#modaleFile").modal("show");
  };

  getBills() {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then((snapshot) => {
          const parseTs = (d) => {
            const t = Date.parse(d);
            return Number.isNaN(t) ? 0 : t;
          };

          const bills = snapshot
            .map((doc) => {
              try {
                return {
                  ...doc,
                  date: doc.date,
                  status: doc.status,
                };
              } catch (e) {
                // eslint-disable-next-line no-console
                console.log(e, "for", doc);
                return doc;
              }
            })
            .sort((a, b) => parseTs(b.date) - parseTs(a.date));

          return bills;
        });
    }
  }
}
