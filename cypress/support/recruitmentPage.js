class RecruitmentPage {
  visitCandidates() {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewCandidates"
    );
  }

  visitVacancies() {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewJobVacancy"
    );
  }

  inputCandidateName(name) {
    cy.contains("label", "Candidate Name")
      .closest(".oxd-input-group")
      .find('input[placeholder="Type for hints..."]')
      .clear()
      .type(name, { delay: 100 });
  }

  selectCandidateSuggestion(name) {
    cy.get(".oxd-autocomplete-option")
      .contains(name)
      .should("be.visible")
      .click();
  }

  selectCandidateSuggestionIfAvailable(name) {
    cy.get("body").then(($body) => {
      const suggestions = $body.find(".oxd-autocomplete-option:visible");
      const suggestion = [...suggestions].find((option) =>
        option.innerText.includes(name)
      );

      if (suggestion) {
        cy.wrap(suggestion).click();
      } else {
        cy.log(`No autocomplete result for ${name}; searching the entered filter`);
      }
    });
  }

  selectDropdownOption(label, requestedOption) {
    cy.contains("label", label)
      .closest(".oxd-input-group")
      .find(".oxd-select-text")
      .click();

    cy.get("body").then(($body) => {
      const options = [...$body.find(".oxd-select-option:visible")];
      const requested = options.find((option) =>
        option.innerText.includes(requestedOption)
      );

      if (requested) {
        cy.wrap(requested).click();
      } else if (options.length > 1) {
        const availableOptions = options
          .slice(1)
          .map((option) => option.innerText.trim())
          .join(", ");
        throw new Error(
          `${requestedOption} is unavailable for ${label}. Available options: ${availableOptions}`
        );
      } else {
        throw new Error(`No available option found for ${label}`);
      }
    });
  }

  clickAdd() {
    cy.contains("button", "Add").click();
  }

  fillNewCandidate(candidate) {
    cy.get('input[placeholder="First Name"]').type(candidate.firstName);
    cy.get('input[placeholder="Middle Name"]').type(candidate.middleName);
    cy.get('input[placeholder="Last Name"]').type(candidate.lastName);

    this.selectDropdownOption("Vacancy", candidate.vacancy);

    cy.contains("label", "Email")
      .closest(".oxd-input-group")
      .find("input")
      .type(candidate.email);
    cy.contains("label", "Contact Number")
      .closest(".oxd-input-group")
      .find("input")
      .type(candidate.contactNumber);

    const [year, month, day] = candidate.dateOfApplication.split("-");
    cy.get('input[placeholder="yyyy-dd-mm"]')
      .clear()
      .type(`${year}-${day}-${month}`)
      .blur();
  }

  openFirstCandidate() {
    cy.get(".oxd-table-body .oxd-table-row")
      .first()
      .find("button")
      .first()
      .click();
  }

  openCandidateByName(name) {
    cy.get(".oxd-table-body .oxd-table-row")
      .contains(name)
      .closest(".oxd-table-row")
      .find("button")
      .first()
      .click();
  }

  clickShortlisted() {
    cy.contains("button", "Shortlist").click();
  }

  confirmShortlisting() {
    cy.contains("button", "Save").click();
  }

  clickRejected() {
    cy.contains("button", "Reject").click();
  }

  confirmRejection() {
    cy.contains("button", "Save").click();
  }

  verifyCandidateStatus(status, candidateName) {
    this.visitCandidates();
    this.inputCandidateName(candidateName);
    this.selectCandidateSuggestionIfAvailable(candidateName);
    this.clickSearch();
    cy.contains(".oxd-table-body .oxd-table-row", candidateName)
      .should("be.visible")
      .should(($row) => {
        expect($row.text().toLowerCase()).to.include(status.toLowerCase());
      });
  }

  deleteCandidateByName(name) {
    cy.get(".oxd-table-body .oxd-table-row")
      .contains(name)
      .closest(".oxd-table-row")
      .find("button")
      .last()
      .click();
  }

  confirmDelete() {
    cy.contains("button", "Yes, Delete").should("be.visible").click();
  }

  verifyCandidateDeleted() {
    cy.contains("Successfully Deleted").should("be.visible");
  }

  selectFirstVacancyFilter() {
    cy.contains("label", "Vacancy")
      .closest(".oxd-input-group")
      .find(".oxd-select-text")
      .click();
    cy.get(".oxd-select-option").filter(":visible").eq(1).click();
  }

  fillNewVacancy(vacancy) {
    cy.contains("label", "Vacancy Name")
      .closest(".oxd-input-group")
      .find("input")
      .type(vacancy.name);

    this.selectDropdownOption("Job Title", vacancy.jobTitle);

    cy.contains("label", "Hiring Manager")
      .closest(".oxd-input-group")
      .find('input[placeholder="Type for hints..."]')
      .type(vacancy.hiringManager, { delay: 100 });
    cy.get(".oxd-autocomplete-option")
      .contains(vacancy.hiringManager)
      .click();

    cy.contains("label", "Number of Positions")
      .closest(".oxd-input-group")
      .find("input")
      .type(vacancy.numberOfPositions);
  }

  ensureJobTitleAvailable(jobTitle) {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewJobTitleList"
    );
    cy.get(".oxd-table-body").then(($table) => {
      if (!$table.text().includes(jobTitle)) {
        cy.contains("button", "Add").click();
        cy.contains("label", "Job Title")
          .closest(".oxd-input-group")
          .find("input")
          .type(jobTitle);
        cy.contains("button", "Save").click();
        cy.contains("Successfully Saved").should("be.visible");
      }
    });
  }

  ensureHiringManagerAvailable(hiringManager) {
    const [firstName, ...lastNameParts] = hiringManager.split(" ");
    const lastName = lastNameParts.join(" ");

    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList"
    );
    cy.contains("label", "Employee Name")
      .closest(".oxd-input-group")
      .find('input[placeholder="Type for hints..."]')
      .type(hiringManager, { delay: 100 });
    this.selectCandidateSuggestionIfAvailable(hiringManager);
    this.clickSearch();
    cy.get(".oxd-table-body").then(($table) => {
      if (
        !$table.text().includes(firstName) ||
        !$table.text().includes(lastName)
      ) {
        cy.visit(
          "https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee"
        );
        cy.get('input[placeholder="First Name"]').type(firstName);
        cy.get('input[placeholder="Last Name"]').type(lastName);
        cy.contains("button", "Save").click();
        cy.contains("Successfully Saved").should("be.visible");
      }
    });
  }

  ensureVacancyExists(vacancy, existingNames = []) {
    this.visitVacancies();
    cy.get(".oxd-table-body").then(($table) => {
      const currentName = [vacancy.name, ...existingNames].find((name) =>
        $table.text().includes(name)
      );

      if (currentName) {
        this.verifyVacancyInResults(currentName);
      } else {
        this.clickAdd();
        this.fillNewVacancy(vacancy);
        this.clickSave();
        this.visitVacancies();
        this.verifyVacancyInResults(vacancy.name);
      }
    });
  }

  verifyVacancyInResultsOneOf(names) {
    cy.get(".oxd-table-body").should(($body) => {
      expect(names.some((name) => $body.text().includes(name))).to.equal(true);
    });
  }

  editVacancyName(currentName, updatedName) {
    cy.get(".oxd-table-body").then(($table) => {
      const rows = [...$table.find(".oxd-table-row")];
      const row =
        rows.find((item) => item.innerText.includes(currentName)) ||
        rows.find((item) => item.innerText.includes(updatedName));

      if (!row) {
        throw new Error(
          `Could not find vacancy "${currentName}" or "${updatedName}" to edit`
        );
      }

      cy.wrap(row).find("button").filter(":has(.bi-pencil-fill)").click();
    });
    cy.contains("label", "Vacancy Name")
      .closest(".oxd-input-group")
      .find("input")
      .clear()
      .type(updatedName);
  }

  clickSearch() {
    cy.contains("button", "Search").click();
  }

  clickSave() {
    cy.contains("button", "Save").click();
  }

  verifyCandidateInResults(name) {
    cy.contains(".oxd-table-body .oxd-table-row", name).should("be.visible");
  }

  verifyCandidateSearchCompleted() {
    cy.get(".oxd-table-body").should(($body) => {
      const hasRows = $body.find(".oxd-table-row").length > 0;
      const hasEmptyState = $body.text().includes("No Records Found");
      expect(hasRows || hasEmptyState).to.equal(true);
    });
  }

  verifyCandidateDetailsVisible() {
    cy.contains("h6", "Candidate Profile").should("be.visible");
    cy.contains("h6", "Application Stage").should("be.visible");
  }

  verifyVacanciesPageLoaded() {
    cy.contains("h6", "Recruitment").should("be.visible");
    cy.contains("h5", "Vacancies").should("be.visible");
    cy.get(".oxd-table").should("be.visible");
  }

  verifyVacancySearchResults() {
    cy.get(".oxd-table-body").should("be.visible");
    cy.get(".oxd-table-body .oxd-table-row").should(
      "have.length.greaterThan",
      0
    );
  }

  verifyVacancyInResults(name) {
    cy.contains(".oxd-table-body .oxd-table-row", name).should("be.visible");
  }

  verifyVacancySaved(name) {
    this.visitVacancies();
    this.verifyVacancyInResults(name);
  }
}

export default new RecruitmentPage();
