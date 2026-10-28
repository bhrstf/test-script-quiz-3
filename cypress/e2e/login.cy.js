import loginPage from "../support/loginPage";
import loginData from "../fixtures/loginData.json";

describe("Login OrangeHRM", () => {
  beforeEach(() => {
   // cy.visit("/web/index.php/auth/login");
    loginPage.visitPage();
  });

  it("TC-LOG-001 - login pakai akun yang benar", () => {

    //cy.get('input[name="username"]').type("Admin");
    loginPage.inputUsername(loginData.validAdmin.username);
    //cy.get('input[name="password"]').type("admin123");
    loginPage.inputPassword(loginData.validAdmin.password);
    //cy.contains("button", "Login").click();
    loginPage.clickLogin();


   // cy.url().should("include", "/dashboard");
    //cy.get(".oxd-topbar-header-breadcrumb h6").should(
    //  "have.text",
    //  "Dashboard"
    //);
    loginPage.verifyLoginSuccess();
  });


  it("TC-LOG-002 - Login dengan username valid  dan password yang tidak valid", () => {

    //cy.get('input[name="username"]').type("Admin");
    loginPage.inputUsername(loginData.validAdmin.username);
    //cy.get('input[name="password"]').type("admin1245");
    loginPage.inputPassword(loginData.invalidPassword);
    //cy.contains("button", "Login").click();
    loginPage.clickLogin();

    //cy.get(".oxd-alert-content-text").should("have.text", "Invalid credentials");
   loginPage.verifyLoginFailure();
  });

  it("TC-LOG-003 - Login dengan username yang tidak valid  dan password valid", () => {

    //cy.get('input[name="username"]').type("Admin1");
    loginPage.inputUsername(loginData.invalidUsername);
    //cy.get('input[name="password"]').type("admin123");
    loginPage.inputPassword(loginData.validAdmin.password);
    //cy.contains("button", "Login").click();
    loginPage.clickLogin();

    //cy.get(".oxd-alert-content-text").should("have.text", "Invalid credentials");
    loginPage.verifyLoginFailure();
  });

  it("TC-LOG-004 - Login dengan username dan password yang tidak valid", () => {

    //cy.get('input[name="username"]').type("Admin1");
    loginPage.inputUsername(loginData.invalidUsername);
    //cy.get('input[name="password"]').type("admin1247");
    loginPage.inputPassword(loginData.invalidPassword);
    //cy.contains("button", "Login").click();
    loginPage.clickLogin();

    //cy.get(".oxd-alert-content-text").should("have.text", "Invalid credentials");
    loginPage.verifyLoginFailure();
  });

  it("TC-LOG-005 - Login dengan mengosongkan username dan password", () => {

    //cy.contains("button", "Login").click();
    loginPage.clickLogin();

    //cy.get(".oxd-input-field-error-message")
    //  .should("have.length", 2)
     // .each(($message) => {
     //   cy.wrap($message).should("have.text", "Required");
     // });
    loginPage.verifyLoginFailureEmptyFields(2);

  });

  it("TC-LOG-006 - Login dengan mengosongkan username dan mengisi password", () => {

    //cy.get('input[name="password"]').type("admin123");
    loginPage.inputPassword(loginData.validAdmin.password);
    //cy.contains("button", "Login").click();
    loginPage.clickLogin();

    //cy.get(".oxd-input-field-error-message").should("have.text", "Required");
    loginPage.verifyLoginFailureEmptyFields(1);
  });

  it("TC-LOG-007 - Login dengan mengisi username saja", () => {

    //cy.get('input[name="username"]').type("Admin");
    loginPage.inputUsername(loginData.validAdmin.username);
    //cy.contains("button", "Login").click();
    loginPage.clickLogin();

    //cy.get(".oxd-input-field-error-message").should("have.text", "Required");
    loginPage.verifyLoginFailureEmptyFields(1);
  });

  it("TC-LOG-008 - Memvalidasi sensivitas huruf besar/kecil pada Username", () => {

    //cy.get('input[name="username"]').type("admin");
    loginPage.inputUsername(loginData.smallUsername);
    //cy.get('input[name="password"]').type("admin123");
    loginPage.inputPassword(loginData.validAdmin.password);
   // cy.contains("button", "Login").click();
    loginPage.clickLogin();

   // cy.url().should("include", "/dashboard");
    //cy.get(".oxd-topbar-header-breadcrumb h6").should(
    //  "have.text",
    //  "Dashboard"
    //);
    loginPage.verifyLoginSuccess();
  });

  it("TC-LOG-009 - Memvalidasi sensivitas huruf besar/kecil pada password", () => {

    //cy.get('input[name="username"]').type("Admin");
    loginPage.inputUsername(loginData.validAdmin.username);
    //cy.get('input[name="password"]').type("ADMIN123");
    loginPage.inputPassword(loginData.uppercasePassword);
    //cy.contains("button", "Login").click();
    loginPage.clickLogin();

    //cy.get(".oxd-alert-content-text").should("have.text", "Invalid credentials");
    loginPage.verifyLoginFailureInvalidPassword();
  });
/*
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
    cy.reload();

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
*/
});
