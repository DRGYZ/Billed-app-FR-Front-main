import { formatDate, escapeHtml, formatEmployeeName, setFlash } from "../app/format.js";
import DashboardFormUI from "../views/DashboardFormUI.js";
import BigBilledIcon from "../assets/svg/big_billed.js";
import { ROUTES_PATH } from "../constants/routes.js";
import USERS_TEST from "../constants/usersTest.js";
import Logout from "./Logout.js";

export const filteredBills = (data, status) => {
  return data && data.length
    ? data.filter((bill) => {
        let selectCondition;

        // in jest environment
        if (typeof jest !== "undefined") {
          selectCondition = bill.status === status;
        } else {
          /* istanbul ignore next */
          const userEmail = JSON.parse(localStorage.getItem("user")).email;
          selectCondition =
            bill.status === status && ![...USERS_TEST, userEmail].includes(bill.email);
        }

        return selectCondition;
      })
    : [];
};

export const card = (bill) => {
  const displayName = formatEmployeeName(bill);
  return `
    <div class="bill-card" id="open-bill${escapeHtml(bill.id)}" data-testid="open-bill${escapeHtml(
    bill.id
  )}" data-status="${escapeHtml(bill.status || "pending")}">
      <div class="bill-card-name-container">
        <div class="bill-card-name">${escapeHtml(displayName)}</div>
        <span class="bill-card-grey">...</span>
      </div>
      <div class="name-price-container">
        <span>${escapeHtml(bill.name || "Note de frais")}</span>
        <span>${escapeHtml(bill.amount)} €</span>
      </div>
      <div class="date-type-container">
        <span>${escapeHtml(formatDate(bill.date))}</span>
        <span>${escapeHtml(bill.type)}</span>
      </div>
    </div>
  `;
};

export const cards = (bills) => {
  return bills && bills.length ? bills.map((bill) => card(bill)).join("") : "";
};

export const getStatus = (index) => {
  switch (index) {
    case 1:
      return "pending";
    case 2:
      return "accepted";
    case 3:
      return "refused";
  }
};

export default class {
  constructor({ document, onNavigate, store, bills, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    this.expanded = { 1: false, 2: false, 3: false };
    this.currentBillId = null;
    this.detailOpen = false;

    $("#arrow-icon1").click((e) => this.handleShowTickets(e, bills, 1));
    $("#arrow-icon2").click((e) => this.handleShowTickets(e, bills, 2));
    $("#arrow-icon3").click((e) => this.handleShowTickets(e, bills, 3));

    $(".status-bills-header").on("click", (event) => {
      if ($(event.target).closest(".arrow-icon").length) return;
      const idx = $(event.currentTarget).attr("data-toggle-arrow");
      if (idx) $(`#arrow-icon${idx}`).trigger("click");
    });

    new Logout({ localStorage, onNavigate });

    if (typeof jest === "undefined" && Array.isArray(bills) && bills.length > 0) {
      /* istanbul ignore next */
      const pending = filteredBills(bills, "pending");
      /* istanbul ignore next */
      this.handleShowTickets(null, bills, 1);
      /* istanbul ignore next */
      if (pending.length > 0) {
        this.handleEditTicket(null, pending[0], bills);
      }
    }
  }

  handleClickIconEye = () => {
    const billUrl = $("#icon-eye-d").attr("data-bill-url") || "";
    const $modal = $("#modaleFileAdmin1");
    const modalWidth = $modal.width() || 680;
    const imgWidth = Math.max(280, Math.floor(modalWidth * 0.8));

    $modal
      .find(".modal-body")
      .html(
        `<div class="bill-proof-container"><img width="${imgWidth}" src="${escapeHtml(
          billUrl
        )}" alt="Bill"/></div>`
      );

    if (typeof $modal.modal === "function") $modal.modal("show");
  };

  handleEditTicket(e, bill, bills) {
    const isSameBill = this.currentBillId === bill.id && this.detailOpen;

    $(".bill-card").removeClass("is-selected");

    if (isSameBill) {
      $(".dashboard-right-slot").html(`
        <div class="dashboard-empty-state">
          <div id="big-billed-icon" data-testid="big-billed-icon"> ${BigBilledIcon} </div>
          <p>Sélectionnez une note dans la file pour examiner le justificatif et décider de sa validation ou de son refus.</p>
        </div>
      `);
      this.detailOpen = false;
      this.currentBillId = null;
      return;
    }

    $(`#open-bill${bill.id}`).addClass("is-selected");
    $(".dashboard-right-slot").html(DashboardFormUI(bill));

    this.detailOpen = true;
    this.currentBillId = bill.id;

    $("#icon-eye-d").off("click").on("click", this.handleClickIconEye);
    $(".quick-chip")
      .off("click")
      .on("click", (evt) => {
        const note = $(evt.currentTarget).attr("data-quick-note") || "";
        $("#commentary2").val(note).focus();
      });
    $("#btn-accept-bill")
      .off("click")
      .on("click", (evt) => this.handleAcceptSubmit(evt, bill));
    $("#btn-refuse-bill")
      .off("click")
      .on("click", (evt) => this.handleRefuseSubmit(evt, bill));
  }

  submitDecision(bill, status) {
    const comment = $("#commentary2").val();
    const newBill = {
      ...bill,
      status,
      commentAdmin: comment,
    };
    const recordFlashAndNavigate = () => {
      setFlash("billed_admin_flash", {
        status,
        statusLabel: status === "accepted" ? "Note validée" : "Note refusée",
        name: bill.name || "Note de frais",
        amount: bill.amount || 0,
      });
      this.onNavigate(ROUTES_PATH["Dashboard"]);
    };

    const update = this.updateBill(newBill);
    if (update && typeof update.then === "function") {
      return update.then(recordFlashAndNavigate);
    }
    recordFlashAndNavigate();
    return null;
  }

  handleAcceptSubmit = (e, bill) => this.submitDecision(bill, "accepted");

  handleRefuseSubmit = (e, bill) => this.submitDecision(bill, "refused");

  handleShowTickets(e, bills, index) {
    this.expanded[index] = !this.expanded[index];

    const container = $(`#status-bills-container${index}`);
    const arrow = $(`#arrow-icon${index}`);

    if (this.expanded[index]) {
      arrow.css({ transform: "rotate(0deg)" });
      const list = filteredBills(bills, getStatus(index));
      container.html(cards(list));

      list.forEach((bill) => {
        const $card = $(`#open-bill${bill.id}`);
        $card.off("click").on("click", (evt) => this.handleEditTicket(evt, bill, bills));
      });
    } else {
      arrow.css({ transform: "rotate(90deg)" });
      container.html("");
    }

    return bills;
  }

  getBillsAllUsers = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then((snapshot) => {
          const bills = snapshot.map((doc) => ({
            id: doc.id,
            ...doc,
            date: doc.date,
            status: doc.status,
          }));
          return bills;
        })
        .catch((error) => {
          throw error;
        });
    }
  };

  /* istanbul ignore next */
  updateBill = (bill) => {
    if (this.store) {
      return this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: bill.id })
        .then((updated) => updated)
        .catch(console.log);
    }
  };
}
