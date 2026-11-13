import { ROUTES_PATH } from "../constants/routes.js";

export let PREVIOUS_LOCATION = "";

export default class Login {
  constructor({ document, localStorage, onNavigate, store }) {
    this.document = document;
    this.localStorage = localStorage;
    this.onNavigate = onNavigate;
    this.store = store;

    this.buttons = [...document.querySelectorAll(".form-signin button[type=submit]")];
    document.querySelector('[data-testid="form-employee"]')
      ?.addEventListener("submit", this.handleSubmitEmployee);
    document.querySelector('[data-testid="form-admin"]')
      ?.addEventListener("submit", this.handleSubmitAdmin);
  }

  handleSubmitEmployee = (event) => this.submit(event, "employee", "Employee", "Bills");

  handleSubmitAdmin = (event) => this.submit(event, "admin", "Admin", "Dashboard");

  async submit(event, formRole, type, destination) {
    event.preventDefault();
    if (this.pending) return;

    const form = event.currentTarget;
    const email = form.querySelector(`[data-testid="${formRole}-email-input"]`).value;
    const password = form.querySelector(`[data-testid="${formRole}-password-input"]`).value;
    const error = form.querySelector("[role=alert]");

    this.pending = true;
    this.buttons.forEach(button => { button.disabled = true; });
    error.hidden = true;

    try {
      const { jwt } = await this.store.login(JSON.stringify({ email, password }));
      if (!jwt) throw new Error("Missing session token");
      this.localStorage.setItem("jwt", jwt);
      this.localStorage.setItem("user", JSON.stringify({ type, email, status: "connected" }));
    } catch {
      error.textContent = "Connexion impossible. Vérifiez vos identifiants et que l’API Billed est lancée.";
      error.hidden = false;
      return;
    } finally {
      this.pending = false;
      this.buttons.forEach(button => { button.disabled = false; });
    }

    PREVIOUS_LOCATION = ROUTES_PATH[destination];
    this.document.body.style.backgroundColor = "#fff";
    this.onNavigate(PREVIOUS_LOCATION);
  }
}
