export default () => {
  return `
    <div class="page-div">
      <header class="login-ledger-header">
        <div>
          <div class="title-container">
            <span class="login-brand-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z"/>
                <path fill-rule="evenodd" d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z"/>
              </svg>
            </span>
            <div>
              <h1>Billed</h1>
              <p class="login-tagline">Gestion quotidienne des notes de frais et contrôle des justificatifs.</p>
            </div>
          </div>
        </div>
      </header>

      <div class="login-grid">
        <section class="login-card" aria-label="Connexion Employé">
          <div class="login-card-head">
            <div>
              <h2 class="h3 mb-0">Employé</h2>
              <p class="login-role-desc">Déclarer une dépense et suivre vos remboursements</p>
            </div>
            <span class="status-pill status-pill--pending">Saisie &amp; suivi</span>
          </div>

          <div class="login-demo-row">
            <span class="mono">employee@test.tld · employee</span>
            <button type="button" class="btn-ledger-ghost" data-fill-role="employee">Remplir démo</button>
          </div>

          <form class="form-signin" data-testid="form-employee">
            <div class="login-field">
              <label for="employee-email">Votre email</label>
              <input type="email" id="employee-email" data-testid="employee-email-input" class="form-control" placeholder="nom@entreprise.fr" autocomplete="username" required autofocus>
            </div>
            <div class="login-field">
              <label for="employee-password">Mot de passe</label>
              <input type="password" id="employee-password" data-testid="employee-password-input" class="form-control" placeholder="Votre mot de passe" autocomplete="current-password" required>
            </div>
            <p class="text-danger mt-1 mb-0" role="alert" hidden></p>
            <button class="login-submit-btn" data-testid="employee-login-button" type="submit">Se connecter</button>
          </form>
        </section>

        <section class="login-card" aria-label="Connexion Administration">
          <div class="login-card-head">
            <div>
              <h2 class="h3 mb-0">Administration</h2>
              <p class="login-role-desc">Contrôler les justificatifs et arbitrer la file</p>
            </div>
            <span class="status-pill status-pill--accepted">Contrôle RH</span>
          </div>

          <div class="login-demo-row">
            <span class="mono">admin@test.tld · admin</span>
            <button type="button" class="btn-ledger-ghost" data-fill-role="admin">Remplir démo</button>
          </div>

          <form class="form-signin" data-testid="form-admin">
            <div class="login-field">
              <label for="admin-email">Votre email</label>
              <input type="email" id="admin-email" data-testid="admin-email-input" class="form-control" placeholder="rh@entreprise.fr" autocomplete="username" required>
            </div>
            <div class="login-field">
              <label for="admin-password">Mot de passe</label>
              <input type="password" id="admin-password" data-testid="admin-password-input" class="form-control" placeholder="Votre mot de passe" autocomplete="current-password" required>
            </div>
            <p class="text-danger mt-1 mb-0" role="alert" hidden></p>
            <button type="submit" class="login-submit-btn" data-testid="admin-login-button">Se connecter</button>
          </form>
        </section>
      </div>
    </div>
  `;
};
