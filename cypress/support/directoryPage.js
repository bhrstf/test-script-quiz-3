class DirectoryPage {
  visitPage() {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory"
    );
  }

  inputEmployeeName(name) {
    cy.contains("label", "Employee Name")
      .closest(".oxd-input-group")
      .find('input[placeholder="Type for hints..."]')
      .clear()
      .type(name, { delay: 100 });
  }

  selectFilter(label, option) {
    cy.contains("label", label)
      .closest(".oxd-input-group")
      .find(".oxd-select-text")
      .click();
    cy.get(".oxd-select-option").contains(option).click();
  }

  clickSearch() {
    cy.contains("button", "Search").click();
  }

  clickReset() {
    cy.contains("button", "Reset").click();
  }

  selectEmployee(name) {
    cy.get(".orangehrm-directory-card")
      .contains(".orangehrm-directory-card-header", name)
      .closest(".orangehrm-directory-card")
      .click({ force: true });
  }

  verifyPageLoaded() {
    cy.contains("h6", "Directory").should("be.visible");
    cy.contains("Records Found").should("be.visible");
  }

  verifyEmployeeCardsVisible() {
    cy.get(".orangehrm-directory-card").should("have.length.greaterThan", 0);
  }

  verifyEmployeeVisible(name) {
    cy.get(".orangehrm-directory-card-header")
      .contains(name)
      .should("be.visible");
  }

  verifyEmployeeJobTitle(jobTitle) {
    cy.get(".orangehrm-directory-card-subtitle")
      .contains(jobTitle)
      .should("be.visible");
  }

  verifyEmployeeLocation(location) {
    cy.get(".orangehrm-directory-card-description")
      .contains(location)
      .should("be.visible");
  }

  verifyEmployeeDetailsVisible(name) {
    this.verifyEmployeeVisible(name);
    cy.get(".orangehrm-directory-card-body").should("be.visible");
  }

  verifyPhoneContactActionUnavailable(name) {
    cy.get(".orangehrm-directory-card")
      .contains(".orangehrm-directory-card-header", name)
      .closest(".orangehrm-directory-card")
      .find('a[href^="tel:"], i[class*="telephone"], i[class*="phone"]')
      .should("not.exist");
  }

  verifyEmailContactActionUnavailable(name) {
    cy.get(".orangehrm-directory-card")
      .contains(".orangehrm-directory-card-header", name)
      .closest(".orangehrm-directory-card")
      .find('a[href^="mailto:"], i[class*="envelope"], i[class*="email"]')
      .should("not.exist");
  }

  clearEmployeeName() {
    cy.contains("label", "Employee Name")
      .closest(".oxd-input-group")
      .find('input[placeholder="Type for hints..."]')
      .clear();
  }

  verifyEmployeeQrCode() {
    cy.get('[class*="qr"], img[alt*="QR"], canvas')
      .filter(":visible")
      .should("have.length.greaterThan", 0);
  }

  verifyFiltersCleared() {
    cy.contains("label", "Employee Name")
      .closest(".oxd-input-group")
      .find("input")
      .should("have.value", "");
    cy.contains("label", "Job Title")
      .closest(".oxd-input-group")
      .find(".oxd-select-text")
      .should("contain.text", "-- Select --");
    cy.contains("label", "Location")
      .closest(".oxd-input-group")
      .find(".oxd-select-text")
      .should("contain.text", "-- Select --");
  }
}

export default new DirectoryPage();
