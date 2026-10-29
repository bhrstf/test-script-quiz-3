const baseUrl = "https://reqres.in/api";

function isRateLimited(response) {
  if (response.status === 429) {
    expect(response.body.error).to.equal("rate_limit_exceeded");
    return true;
  }

  return false;
}

describe("Pengujian API ReqRes", () => {
  it("TC-API-001 - menampilkan daftar pengguna pada halaman kedua", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/users?page=2`,
      failOnStatusCode: false,
    }).then((response) => {
      if (isRateLimited(response)) return;

      expect(response.status).to.equal(200);
      expect(response.body.page).to.equal(2);
      expect(response.body.data[0].email).to.equal(
        "michael.lawson@reqres.in"
      );
    });
  });

  it("TC-API-002 - menampilkan detail pengguna dengan ID 2", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/users/2`,
      failOnStatusCode: false,
    }).then((response) => {
      if (isRateLimited(response)) return;

      expect(response.status).to.equal(200);
      expect(response.body.data.id).to.equal(2);
      expect(response.body.data.email).to.equal("janet.weaver@reqres.in");
    });
  });

  it("TC-API-003 - menampilkan respons saat pengguna tidak ditemukan", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/users/23`,
      failOnStatusCode: false,
    }).then((response) => {
      if (isRateLimited(response)) return;

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({});
    });
  });

  it("TC-API-004 - menampilkan daftar sumber daya", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/unknown`,
      failOnStatusCode: false,
    }).then((response) => {
      if (isRateLimited(response)) return;

      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.length(6);
      expect(response.body.data[0].name).to.equal("cerulean");
    });
  });

  it("TC-API-005 - membuat data pengguna baru", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/users`,
      body: {
        name: "morpheus",
        job: "leader",
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (isRateLimited(response)) return;

      expect(response.status).to.equal(201);
      expect(response.body.name).to.equal("morpheus");
      expect(response.body.job).to.equal("leader");
      expect(response.body.id).to.exist;
    });
  });

  it("TC-API-006 - mengganti data pengguna", () => {
    cy.request({
      method: "PUT",
      url: `${baseUrl}/users/2`,
      body: {
        name: "morpheus",
        job: "zion resident",
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (isRateLimited(response)) return;

      expect(response.status).to.equal(200);
      expect(response.body.name).to.equal("morpheus");
      expect(response.body.job).to.equal("zion resident");
    });
  });

  it("TC-API-007 - memperbarui sebagian data pengguna", () => {
    cy.request({
      method: "PATCH",
      url: `${baseUrl}/users/2`,
      body: {
        name: "morpheus",
        job: "zion resident",
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (isRateLimited(response)) return;

      expect(response.status).to.equal(200);
      expect(response.body.name).to.equal("morpheus");
      expect(response.body.job).to.equal("zion resident");
    });
  });

  it("TC-API-008 - menghapus data pengguna", () => {
    cy.request({
      method: "DELETE",
      url: `${baseUrl}/users/2`,
      failOnStatusCode: false,
    }).then((response) => {
      if (isRateLimited(response)) return;

      expect(response.status).to.equal(204);
      expect(response.body).to.equal("");
    });
  });

  it("TC-API-009 - melakukan registrasi dengan data yang valid", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/register`,
      body: {
        email: "eve.holt@reqres.in",
        password: "pistol",
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (isRateLimited(response)) return;

      expect(response.status).to.equal(200);
      expect(response.body.id).to.equal(4);
      expect(response.body.token).to.equal("QpwL5tke4Pnpja7X4");
    });
  });

  it("TC-API-010 - menolak registrasi tanpa kata sandi", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/register`,
      body: {
        email: "sydney@fife",
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (isRateLimited(response)) return;

      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal("Missing password");
    });
  });

  it("TC-API-011 - memvalidasi login dengan data yang valid", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/login`,
      body: {
        email: "eve.holt@reqres.in",
        password: "cityslicka",
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (isRateLimited(response)) return;

      expect(response.status).to.equal(200);
      expect(response.body.token).to.equal("QpwL5tke4Pnpja7X4");
    });
  });

  it("TC-API-012 - menolak login tanpa kata sandi", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/login`,
      body: {
        email: "peter@klaven",
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (isRateLimited(response)) return;

      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal("Missing password");
    });
  });
});
