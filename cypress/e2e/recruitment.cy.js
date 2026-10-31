import loginPage from "../support/loginPage";
import recruitmentPage from "../support/recruitmentPage";
import loginData from "../fixtures/loginData.json";
import recruitmentData from "../fixtures/recruitmentData.json";

const loginAsAdmin = () => {
  loginPage.visitPage();
  loginPage.inputUsername(loginData.validAdmin.username);
  loginPage.inputPassword(loginData.validAdmin.password);
  loginPage.clickLogin();
};

describe("Recruitment OrangeHRM", () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get("body").then(($body) => {
      if ($body.text().includes("Session Expired")) {
        loginAsAdmin();
      }
    });
    loginPage.verifyLoginSuccess();
  });

  it("TC-RCM-025 - Verifikasi pencarian kandidat menggunakan filter pencarian", () => {
    // 1. Buka menu Recruitment.
    // 2. Masukkan/pilih kriteria pencarian kandidat.
    // 3. Tekan tombol Search.
    // Data Excel: data kandidat.
    recruitmentPage.visitCandidates();
    recruitmentPage.inputCandidateName(recruitmentData.candidateSearchName);
    recruitmentPage.selectCandidateSuggestionIfAvailable(
      recruitmentData.candidateSearchName
    );
    recruitmentPage.clickSearch();
    recruitmentPage.verifyCandidateSearchCompleted();
  });

  it("TC-RCM-026 - Menambahkan kandiddat", () => {
    // 1. Buka menu Recruitment.
    // 2. Pilih Add+ pada halaman Candidates.
    // 3. Isi data kandidat sesuai field.
    // Data Excel: Data kandidat yang ingin ditambahkan.
    recruitmentPage.ensureHiringManagerAvailable(
      recruitmentData.candidateVacancy.hiringManager
    );
    recruitmentPage.ensureVacancyExists(recruitmentData.candidateVacancy);
    recruitmentPage.visitCandidates();
    recruitmentPage.clickAdd();
    recruitmentPage.fillNewCandidate(recruitmentData.newCandidate);
    recruitmentPage.clickSave();
    recruitmentPage.visitCandidates();
    recruitmentPage.verifyCandidateInResults(
      recruitmentData.newCandidate.firstName
    );
  });

  it("TC-RCM-027 - Melihat detail profil kandidat", () => {
    // 1. Buka menu Recruitment.
    // 2. Pilih icon mata pada salah satu kandidat.
    // Data Excel: -.
    recruitmentPage.visitCandidates();
    recruitmentPage.openFirstCandidate();
    recruitmentPage.verifyCandidateDetailsVisible();
  });

  it("TC-RCM-028 - Mengubah status kandidat 'Shortlisted'", () => {
    // 1. Buka menu Recruitment.
    // 2. Pilih icon mata pada salah satu kandidat.
    // 3. Tekan tombol Shortlisted pada detail kandidat.
    // Data Excel: -.
    recruitmentPage.visitCandidates();
    recruitmentPage.openCandidateByName(
      `${recruitmentData.newCandidate.firstName} ${recruitmentData.newCandidate.middleName} ${recruitmentData.newCandidate.lastName}`
    );
    recruitmentPage.clickShortlisted();
    recruitmentPage.confirmShortlisting();
    recruitmentPage.verifyCandidateStatus(
      recruitmentData.shortlistedStatus,
      `${recruitmentData.newCandidate.firstName} ${recruitmentData.newCandidate.middleName} ${recruitmentData.newCandidate.lastName}`
    );
  });

  it("TC-RCM-029 - Mengubah status kandidat 'Rejected'", () => {
    // 1. Buka menu Recruitment.
    // 2. Pilih icon mata pada salah satu kandidat.
    // 3. Tekan tombol Rejected pada detail kandidat.
    // Data Excel: -.
    recruitmentPage.visitCandidates();
    recruitmentPage.openCandidateByName(
      `${recruitmentData.newCandidate.firstName} ${recruitmentData.newCandidate.middleName} ${recruitmentData.newCandidate.lastName}`
    );
    recruitmentPage.clickRejected();
    recruitmentPage.confirmRejection();
    recruitmentPage.verifyCandidateStatus(
      recruitmentData.rejectedStatus,
      `${recruitmentData.newCandidate.firstName} ${recruitmentData.newCandidate.middleName} ${recruitmentData.newCandidate.lastName}`
    );
  });

  it("TC-RCM-030 - Menghapus data kandidat dari daftar", () => {
    // 1. Buka menu Recruitment.
    // 2. Pilih icon hapus pada salah satu kandidat di daftar.
    // Data Excel: -.
    recruitmentPage.visitCandidates();
    recruitmentPage.deleteCandidateByName(
      `${recruitmentData.newCandidate.firstName} ${recruitmentData.newCandidate.middleName} ${recruitmentData.newCandidate.lastName}`
    );
    recruitmentPage.confirmDelete();
    recruitmentPage.verifyCandidateDeleted();
  });

  it("TC-RCM-031 - Membuka halaman vacancies", () => {
    // 1. Buka menu Recruitment.
    // 2. Pilih menu Vacancies pada bagian atas.
    // Data Excel: -.
    recruitmentPage.visitVacancies();
    recruitmentPage.verifyVacanciesPageLoaded();
  });

  it("TC-RCM-032 - Mencari vancancy melalui fitur pencarian", () => {
    // 1. Buka menu Recruitment, lalu pilih menu Vacancies.
    // 2. Pilih/isi kriteria pencarian seperti job title atau vacancy.
    // 3. Tekan tombol Search.
    // Data Excel: - (menggunakan vacancy pertama yang tersedia).
    recruitmentPage.visitVacancies();
    recruitmentPage.selectFirstVacancyFilter();
    recruitmentPage.clickSearch();
    recruitmentPage.verifyVacancySearchResults();
  });

  it("TC-RCM-033 - Menambahkan Vacancy", () => {
    // 1. Buka menu Recruitment, lalu pilih menu Vacancies.
    // 2. Tekan tombol Add+.
    // 3. Isi field sesuai vacancy yang ingin ditambahkan.
    // Data Excel: - (nilai input eksekusi diambil dari recruitmentData.json).
    recruitmentPage.ensureJobTitleAvailable(
      recruitmentData.newVacancy.jobTitle
    );
    recruitmentPage.ensureHiringManagerAvailable(
      recruitmentData.newVacancy.hiringManager
    );
    recruitmentPage.ensureVacancyExists(
      recruitmentData.newVacancy,
      [recruitmentData.updatedVacancyName]
    );
    recruitmentPage.visitVacancies();
    recruitmentPage.verifyVacancyInResultsOneOf([
      recruitmentData.newVacancy.name,
      recruitmentData.updatedVacancyName,
    ]);
  });

  it("TC-RCM-034 - Mengedit informasi vacancy", () => {
    // 1. Buka menu Recruitment, lalu pilih menu Vacancies.
    // 2. Tekan icon pensil pada kolom aksi vacancy.
    // 3. Ubah informasi vacancy.
    // 4. Tekan tombol Save.
    // Data Excel: - (menggunakan vacancy pertama yang tersedia).
    recruitmentPage.visitVacancies();
    recruitmentPage.editVacancyName(
      recruitmentData.newVacancy.name,
      recruitmentData.updatedVacancyName
    );
    recruitmentPage.clickSave();
    recruitmentPage.verifyVacancySaved(recruitmentData.updatedVacancyName);
  });
});
