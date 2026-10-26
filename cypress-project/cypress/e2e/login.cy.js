describe("Login OrangeHRM", () => {
  const interceptLoginRequest = (alias, credentials) => {
    cy.intercept("POST", "/web/index.php/auth/validate", (request) => {
      const body = new URLSearchParams(request.body);
      expect(body.get("username")).to.eq(credentials.username);
      expect(body.get("password")).to.eq(credentials.password);
    }).as(alias);
  };

  beforeEach(() => {
    cy.visit("/web/index.php/auth/login");
  });

  it("TC-LOG-001 - login pakai akun yang benar", () => {
    interceptLoginRequest("validAdminLogin", {
      username: "Admin",
      password: "admin123",
    });

    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("admin123");
    cy.contains("button", "Login").click();

    cy.wait("@validAdminLogin").its("response.statusCode").should("eq", 302);

    cy.url().should("include", "/dashboard");
    cy.get(".oxd-topbar-header-breadcrumb h6").should(
      "have.text",
      "Dashboard"
    );
  });

  it("TC-LOG-002 - password salah bikin login gagal", () => {
    interceptLoginRequest("wrongPasswordLogin", {
      username: "Admin",
      password: "admin1245",
    });

    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("admin1245");
    cy.contains("button", "Login").click();

    cy.wait("@wrongPasswordLogin");
    cy.get(".oxd-alert-content-text").should("have.text", "Invalid credentials");
  });

  it("TC-LOG-003 - username yang tidak terdaftar bikin login gagal", () => {
    interceptLoginRequest("unknownUserLogin", {
      username: "Admin1",
      password: "admin123",
    });

    cy.get('input[name="username"]').type("Admin1");
    cy.get('input[name="password"]').type("admin123");
    cy.contains("button", "Login").click();

    cy.wait("@unknownUserLogin");
    cy.get(".oxd-alert-content-text").should("have.text", "Invalid credentials");
  });

  it("TC-LOG-004 - username dan password salah bikin login gagal", () => {
    interceptLoginRequest("unknownUserWrongPasswordLogin", {
      username: "Admin1",
      password: "admin1247",
    });

    cy.get('input[name="username"]').type("Admin1");
    cy.get('input[name="password"]').type("admin1247");
    cy.contains("button", "Login").click();

    cy.wait("@unknownUserWrongPasswordLogin");
    cy.get(".oxd-alert-content-text").should("have.text", "Invalid credentials");
  });

  it("TC-LOG-005 - username dan password wajib diisi", () => {
    cy.intercept("POST", "/web/index.php/auth/validate").as(
      "emptyCredentialsLogin"
    );

    cy.contains("button", "Login").click();

    cy.get(".oxd-input-field-error-message")
      .should("have.length", 2)
      .each(($message) => {
        cy.wrap($message).should("have.text", "Required");
      });
    cy.get("@emptyCredentialsLogin.all").should("have.length", 0);
  });

  it("TC-LOG-006 - username kosong tidak bisa login", () => {
    cy.intercept("POST", "/web/index.php/auth/validate").as(
      "missingUsernameLogin"
    );

    cy.get('input[name="password"]').type("admin123");
    cy.contains("button", "Login").click();

    cy.get(".oxd-input-field-error-message").should("have.text", "Required");
    cy.get("@missingUsernameLogin.all").should("have.length", 0);
  });

  it("TC-LOG-007 - password kosong tidak bisa login", () => {
    cy.intercept("POST", "/web/index.php/auth/validate").as(
      "missingPasswordLogin"
    );

    cy.get('input[name="username"]').type("Admin");
    cy.contains("button", "Login").click();

    cy.get(".oxd-input-field-error-message").should("have.text", "Required");
    cy.get("@missingPasswordLogin.all").should("have.length", 0);
  });

  it("TC-LOG-008 - username tetap diterima meski hurufnya kecil", () => {
    interceptLoginRequest("lowercaseUsernameLogin", {
      username: "admin",
      password: "admin123",
    });

    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.contains("button", "Login").click();

    cy.wait("@lowercaseUsernameLogin");
    cy.url().should("include", "/dashboard");
    cy.get(".oxd-topbar-header-breadcrumb h6").should(
      "have.text",
      "Dashboard"
    );
  });

  it("TC-LOG-009 - password membedakan huruf besar dan kecil", () => {
    interceptLoginRequest("uppercasePasswordLogin", {
      username: "Admin",
      password: "ADMIN123",
    });

    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("ADMIN123");
    cy.contains("button", "Login").click();

    cy.wait("@uppercasePasswordLogin");
    cy.get(".oxd-alert-content-text").should("have.text", "Invalid credentials");
  });

  it("TC-LOG-010 - karakter password disembunyikan", () => {
    cy.intercept("POST", "/web/index.php/auth/validate").as(
      "passwordMaskLoginRequest"
    );

    cy.get('input[name="password"]')
      .type("admin123")
      .should("have.attr", "type", "password")
      .and("have.value", "admin123");
    cy.get("@passwordMaskLoginRequest.all").should("have.length", 0);
  });

  it("TC-LOG-011 - kirim permintaan reset password untuk username yang valid", () => {
    cy.intercept(
      "POST",
      "**/auth/**",
      (request) => {
        const body = new URLSearchParams(request.body);
        expect(body.get("username")).to.eq("Admin");
        expect(request.url).to.include("/auth/");
        request.reply({
          statusCode: 200,
          headers: { "content-type": "text/html" },
          body: "<html><body>Reset Password link sent successfully</body></html>",
        });
      }
    ).as("adminPasswordReset");

    cy.contains("Forgot your password?").click();

    cy.url().should("include", "/auth/requestPasswordResetCode");
    cy.contains("h6", "Reset Password").should("be.visible");
    cy.get('input[name="username"]').type("Admin");
    cy.contains("button", "Reset Password").click();

    cy.wait("@adminPasswordReset").its("response.statusCode").should("eq", 200);
    cy.contains("Reset Password link sent successfully").should("be.visible");
  });

  it("TC-LOG-012 - elemen utama di halaman login tampil", () => {
    cy.intercept("GET", "**/core/i18n/messages", (request) => {
      expect(request.url).to.include("/core/i18n/messages");
      request.continue();
    }).as("loginPageTranslations");
    cy.reload();
    cy.wait("@loginPageTranslations")
      .its("request.url")
      .should("include", "/core/i18n/messages");

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
