import { ROUTES_PATH } from "../constants/routes.js";
import { setFlash } from "../app/format.js";
import Logout from "./Logout.js";

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    this.localStorage = localStorage;

    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`);
    formNewBill.addEventListener("submit", this.handleSubmit);

    const file = this.document.querySelector(`input[data-testid="file"]`);
    file.addEventListener("change", this.handleChangeFile);
    this.fileInput = file;
    this.submitButton = formNewBill.querySelector('button[type="submit"]');
    this.fileError = formNewBill.querySelector('[data-testid="file-error"]');
    this.saveError = formNewBill.querySelector('[data-testid="save-error"]');
    this.previewCard = this.document.getElementById("receipt-preview-card");
    this.previewImg = this.document.getElementById("receipt-preview-img");
    this.previewName = this.document.getElementById("receipt-preview-name");
    this.objectPreviewUrl = null;
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;

    const clearPreview = () => this.updatePreview(false);
    const navigateBack = () => {
      clearPreview();
      this.onNavigate(ROUTES_PATH["Bills"]);
    };
    this.document.getElementById("btn-cancel-bill")?.addEventListener("click", navigateBack);
    this.document.getElementById("layout-icon1")?.addEventListener("click", navigateBack);
    this.document.getElementById("layout-disconnect")?.addEventListener("click", clearPreview);

    new Logout({ document, localStorage, onNavigate });
  }

  updatePreview(show, fileName = "", imageUrl = "") {
    if (!this.previewCard) return;
    if (!show) {
      if (this.objectPreviewUrl) {
        URL.revokeObjectURL(this.objectPreviewUrl);
        this.objectPreviewUrl = null;
      }
      this.previewCard.hidden = true;
      if (this.previewImg) this.previewImg.src = "";
      if (this.previewName) this.previewName.textContent = "";
      return;
    }
    if (this.previewName) this.previewName.textContent = fileName;
    if (this.previewImg && imageUrl) this.previewImg.src = imageUrl;
    this.previewCard.hidden = false;
  }

  handleChangeFile = async (e) => {
    if (this.busy) return;
    const file = e.target.files?.[0];
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    this.fileError.textContent = "";
    this.saveError.textContent = "";
    this.updatePreview(false);
    if (!file) return;

    const fileName = file.name;
    const isValid = /\.(jpe?g|png)$/i.test(fileName);

    if (!isValid) {
      e.target.value = "";
      this.fileError.textContent = "Formats acceptés : jpg, jpeg, png";
      return;
    }

    const formData = new FormData();
    const email = JSON.parse(this.localStorage.getItem("user")).email;
    formData.append("file", file);
    formData.append("email", email);

    this.setBusy(true);
    try {
      const { fileUrl, key } = await this.store.bills().create({
        data: formData,
        headers: { noContentType: true },
      });
      this.billId = key;
      this.fileUrl = fileUrl;
      this.fileName = fileName;

      if (!this.fileInput.isConnected) return;
      if (typeof URL.createObjectURL === "function") {
        this.objectPreviewUrl = URL.createObjectURL(file);
      }
      this.updatePreview(true, fileName, this.objectPreviewUrl || fileUrl);
    } catch {
      this.fileInput.value = "";
      this.updatePreview(false);
      this.fileError.textContent = "Envoi du justificatif impossible. Réessayez.";
    } finally {
      this.setBusy(false);
    }
  };

  setBusy(busy) {
    this.busy = busy;
    this.fileInput.disabled = busy;
    this.submitButton.disabled = busy;
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.busy) return;
    if (!this.billId) {
      this.fileError.textContent = "Ajoutez un justificatif avant d’envoyer la note.";
      this.fileInput.focus();
      return;
    }
    const email = JSON.parse(this.localStorage.getItem("user")).email;
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value, 10),
      date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value, 10) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: "pending",
    };
    this.saveError.textContent = "";
    this.setBusy(true);
    try {
      await this.updateBill(bill);
      setFlash("billed_flash", {
        name: bill.name || "Note de frais",
        amount: Number.isNaN(bill.amount) ? 0 : bill.amount,
      });
    } catch {
      this.saveError.textContent = "Envoi de la note impossible. Réessayez.";
      return;
    } finally {
      this.setBusy(false);
    }
    this.updatePreview(false);
    if (e.target.isConnected) this.onNavigate(ROUTES_PATH["Bills"]);
  };

  updateBill = (bill) =>
    this.store.bills().update({ data: JSON.stringify(bill), selector: this.billId });
}
