describe("Login OrangeHRM", () => {
  beforeEach(() => {
    cy.visit("/web/index.php/auth/login");
  });

  it("TC-LOG-001 - login pakai akun yang benar", () => {
    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("admin123");
    cy.contains("button", "Login").click();

    cy.url().should("include", "/dashboard");
    cy.get(".oxd-topbar-header-breadcrumb h6").should(
      "have.text",
      "Dashboard"
    );
  });

  it("TC-LOG-002 - password salah bikin login gagal", () => {
    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("admin1245");
    cy.contains("button", "Login").click();

    cy.get(".oxd-alert-content-text").should("have.text", "Invalid credentials");
  });

  it("TC-LOG-003 - username yang tidak terdaftar bikin login gagal", () => {
    cy.get('input[name="username"]').type("Admin1");
    cy.get('input[name="password"]').type("admin123");
    cy.contains("button", "Login").click();

    cy.get(".oxd-alert-content-text").should("have.text", "Invalid credentials");
  });

  it("TC-LOG-004 - username dan password salah bikin login gagal", () => {
    cy.get('input[name="username"]').type("Admin1");
    cy.get('input[name="password"]').type("admin1247");
    cy.contains("button", "Login").click();

    cy.get(".oxd-alert-content-text").should("have.text", "Invalid credentials");
  });

  it("TC-LOG-005 - username dan password wajib diisi", () => {
    cy.contains("button", "Login").click();

    cy.get(".oxd-input-field-error-message")
      .should("have.length", 2)
      .each(($message) => {
        cy.wrap($message).should("have.text", "Required");
      });
  });

  it("TC-LOG-006 - username kosong tidak bisa login", () => {
    cy.get('input[name="password"]').type("admin123");
    cy.contains("button", "Login").click();

    cy.get(".oxd-input-field-error-message").should("have.text", "Required");
  });

  it("TC-LOG-007 - password kosong tidak bisa login", () => {
    cy.get('input[name="username"]').type("Admin");
    cy.contains("button", "Login").click();

    cy.get(".oxd-input-field-error-message").should("have.text", "Required");
  });

  it("TC-LOG-008 - username tetap diterima meski hurufnya kecil", () => {
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.contains("button", "Login").click();

    cy.url().should("include", "/dashboard");
    cy.get(".oxd-topbar-header-breadcrumb h6").should(
      "have.text",
      "Dashboard"
    );
  });

  it("TC-LOG-009 - password membedakan huruf besar dan kecil", () => {
    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("ADMIN123");
    cy.contains("button", "Login").click();

    cy.get(".oxd-alert-content-text").should("have.text", "Invalid credentials");
  });

  it("TC-LOG-010 - karakter password disembunyikan", () => {
    cy.get('input[name="password"]')
      .type("admin123")
      .should("have.attr", "type", "password")
      .and("have.value", "admin123");
  });

  it("TC-LOG-011 - kirim permintaan reset password untuk username yang valid", () => {
    cy.contains("Forgot your password?").click();

    cy.url().should("include", "/auth/requestPasswordResetCode");
    cy.contains("h6", "Reset Password").should("be.visible");
    cy.get('input[name="username"]').type("Admin");
    cy.contains("button", "Reset Password").click();

    cy.contains("Reset Password link sent successfully").should("be.visible");
  });

  it("TC-LOG-012 - elemen utama di halaman login tampil", () => {
    cy.contains("h5", "Login").should("be.visible");
    cy.get('img[alt="company-branding"]').should("be.visible");
    cy.get('img[alt="orangehrm-logo"]').should("be.visible");
    cy.get('input[name="username"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.contains("button", "Login").should("be.visible");
    cy.contains("Forgot your password?").should("be.visible");

    cy.get('a[href*="linkedin.com"]').should("be.visible");
    cy.get('a[href*="facebook.com"]').should("be.visible");
    cy.get('a[href*="twitter.com"]').should("be.visible");
    cy.get('a[href*="youtube.com"]').should("be.visible");
  });
});
