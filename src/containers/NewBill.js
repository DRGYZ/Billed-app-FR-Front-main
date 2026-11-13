import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    this.localStorage = localStorage;
    const formNewBill = this.document.querySelector(
      `form[data-testid="form-new-bill"]`
    );
    formNewBill.addEventListener("submit", this.handleSubmit);
    const file = this.document.querySelector(`input[data-testid="file"]`);
    file.addEventListener("change", this.handleChangeFile);
    this.fileInput = file;
    this.submitButton = formNewBill.querySelector('button[type="submit"]');
    this.fileError = formNewBill.querySelector('[data-testid="file-error"]');
    this.saveError = formNewBill.querySelector('[data-testid="save-error"]');
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    new Logout({ document, localStorage, onNavigate });
  }
  handleChangeFile = async (e) => {
    if (this.busy) return;
    const file = e.target.files?.[0];
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    this.fileError.textContent = "";
    this.saveError.textContent = "";
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
    } catch {
      this.fileInput.value = "";
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
      amount: parseInt(
        e.target.querySelector(`input[data-testid="amount"]`).value
      ),
      date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct:
        parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) ||
        20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`)
        .value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: "pending",
    };
    this.saveError.textContent = "";
    this.setBusy(true);
    try {
      await this.updateBill(bill);
    } catch {
      this.saveError.textContent = "Envoi de la note impossible. Réessayez.";
      return;
    } finally {
      this.setBusy(false);
    }
    if (e.target.isConnected) this.onNavigate(ROUTES_PATH["Bills"]);
  };

  updateBill = (bill) =>
    this.store.bills().update({ data: JSON.stringify(bill), selector: this.billId });
}
