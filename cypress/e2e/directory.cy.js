import loginPage from "../support/loginPage";
import directoryPage from "../support/directoryPage";
import loginData from "../fixtures/loginData.json";
import directoryData from "../fixtures/directoryData.json";

describe("Directory OrangeHRM", () => {
  beforeEach(() => {
    loginPage.visitPage();
    loginPage.inputUsername(loginData.validAdmin.username);
    loginPage.inputPassword(loginData.validAdmin.password);
    loginPage.clickLogin();
    loginPage.verifyLoginSuccess();
    directoryPage.visitPage();
  });

  it("TC-DRC-013 - Membuka fitur diectory", () => {
    // 1. Login hingga beranda tampil.
    // 2. Buka fitur Directory.
    directoryPage.verifyPageLoaded();
    directoryPage.verifyEmployeeCardsVisible();
  });

  it("TC-DRC-014 - Mecari salah satu karyawan dari list karyawan dengan fitur pencarian", () => {
    // 1. Login hingga beranda tampil, lalu buka Directory.
    // 2. Isi employee name, job title, dan location dari salah satu karyawan.
    // Data Excel: Peter Mac Anderson, Chief Financial Officer, New York Sales Office.
    directoryPage.inputEmployeeName(directoryData.knownEmployee);
    directoryPage.selectFilter("Job Title", directoryData.jobTitle);
    directoryPage.selectFilter("Location", directoryData.location);
    directoryPage.clickSearch();

    directoryPage.verifyEmployeeVisible(directoryData.knownEmployee);
    directoryPage.verifyEmployeeJobTitle(directoryData.jobTitle);
    directoryPage.verifyEmployeeLocation(directoryData.location);
  });

  it("TC-DRC-015 - Mencarii karyawan berdasarkan nama karyawan yang ada di list", () => {
    // 1. Login hingga beranda tampil, lalu buka Directory.
    // 2. Isi employee name dari salah satu karyawan di daftar.
    // Data Excel: Peter Mac Anderson.
    directoryPage.inputEmployeeName(directoryData.knownEmployee);
    directoryPage.clickSearch();
    directoryPage.verifyEmployeeVisible(directoryData.knownEmployee);
  });

  it("TC-DRC-016 - Mencarii karyawan berdasarkan Job title", () => {
    // 1. Login hingga beranda tampil, lalu buka Directory.
    // 2. Pilih salah satu Job Title dari list.
    // Data Excel: Job Title (nilai pilihan yang dipakai: Chief Financial Officer).
    directoryPage.selectFilter("Job Title", directoryData.jobTitle);
    directoryPage.clickSearch();
    directoryPage.verifyEmployeeJobTitle(directoryData.jobTitle);
  });

  it("TC-DRC-017 - Mencarii karyawan berdasarkan Location", () => {
    // 1. Login hingga beranda tampil, lalu buka Directory.
    // 2. Pilih salah satu location dari list.
    // Data Excel tertulis "Job Title"; skenario dan langkah Excel meminta Location.
    directoryPage.selectFilter("Location", directoryData.location);
    directoryPage.clickSearch();
    directoryPage.verifyEmployeeLocation(directoryData.location);
  });

  it("TC-DRC-018 - Menampilkan karyawan yang dipilih dari list", () => {
    // 1. Login hingga beranda tampil, lalu buka Directory.
    // 2. Pilih salah satu karyawan dari list.
    // Data Excel: - (dipilih karyawan yang tersedia).
    directoryPage.selectEmployee(directoryData.knownEmployee);
    directoryPage.verifyEmployeeDetailsVisible(directoryData.knownEmployee);
  });

  it("TC-DRC-019 - Verifikasi fungsi icon telepon pada card detail karyawan", () => {
    // 1. Login hingga beranda tampil, lalu buka Directory.
    // 2. Pilih salah satu karyawan dari list.
    // 3. Tekan icon telepon pada card detail karyawan.
    // Data Excel: - (dipilih karyawan yang tersedia).
    directoryPage.selectEmployee(directoryData.knownEmployee);
    directoryPage.verifyPhoneContactActionUnavailable(
      directoryData.knownEmployee
    );
  });

  it("TC-DRC-020 - Verifikasi fungsi icon email pada card detail karyawan", () => {
    // 1. Login hingga beranda tampil, lalu buka Directory.
    // 2. Pilih salah satu karyawan dari list.
    // 3. Tekan icon email pada card detail karyawan.
    // Data Excel: - (dipilih karyawan yang tersedia).
    directoryPage.selectEmployee(directoryData.knownEmployee);
    directoryPage.verifyEmailContactActionUnavailable(
      directoryData.knownEmployee
    );
  });

  it("TC-DRC-021 - Verifikasi pemindaian scan QR karyawan", () => {
    // 1. Login hingga beranda tampil, lalu buka Directory.
    // 2. Pilih salah satu karyawan dari list.
    // 3. Scan barcode QR pada detail karyawan.
    // Data Excel: - (dipilih karyawan yang tersedia).
    directoryPage.selectEmployee(directoryData.knownEmployee);
    directoryPage.verifyEmployeeQrCode();
  });

  it("TC-DRC-022 - Verifikasi fungsi tombol reset pada filter pencarian", () => {
    // 1. Login hingga beranda tampil, lalu buka Directory.
    // 2. Isi employee name dari salah satu karyawan di list.
    // 3. Tekan tombol Reset untuk menghapus pencarian.
    // Data Excel: Data karyawan (Peter Mac Anderson).
    directoryPage.inputEmployeeName(directoryData.knownEmployee);
    directoryPage.clickReset();
    directoryPage.clearEmployeeName();
    directoryPage.verifyFiltersCleared();
    directoryPage.verifyPageLoaded();
  });
});
