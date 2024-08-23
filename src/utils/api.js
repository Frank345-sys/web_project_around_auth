class Api {
  constructor({ url }) {
    this._baseUrl = url;
    //this._headers = headers;
  }

  _getHeaders() {
    const token = localStorage.getItem("jwt") ?? "";
    return {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async get(complementUrl) {
    const result = await fetch(`${this._baseUrl}${complementUrl}`, {
      method: "GET",
      headers: this._getHeaders(),
    });
    if (!result.ok) {
      throw new Error(`Error: ${result.status}`);
    }
    return result.json();
  }

  async post(complementUrl, body) {
    const result = await fetch(`${this._baseUrl}${complementUrl}`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify(body),
    });
    if (!result.ok) {
      throw new Error(`Error: ${result.status}`);
    }
    return result.json();
  }

  async patch(complementUrl, body) {
    const result = await fetch(`${this._baseUrl}${complementUrl}`, {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify(body),
    });
    if (!result.ok) {
      throw new Error(`Error: ${result.status}`);
    }
    return result.json();
  }

  async delete(complementUrl) {
    const result = await fetch(`${this._baseUrl}${complementUrl}`, {
      method: "DELETE",
      headers: this._getHeaders(),
    });
    if (!result.ok) {
      throw new Error(`Error: ${result.status}`);
    }
    return result.json();
  }

  async put(complementUrl) {
    const result = await fetch(`${this._baseUrl}${complementUrl}`, {
      method: "PUT",
      headers: this._getHeaders(),
    });
    if (!result.ok) {
      throw new Error(`Error: ${result.status}`);
    }
    return result.json();
  }
}

const api = new Api({
  url: "https://api.around-project.mega-link.cl/",
});

/*
const api = new Api({
  url: "http://localhost:3000/",
});

const token = localStorage.getItem("jwt") ?? "";

const api = new Api({
  url: "https://around.nomoreparties.co/v1/web_es_08/",
  headers: {
    authorization: "28d1f77b-3605-449f-bf16-20a5216f8fdb",
    "Content-Type": "application/json",
  },
});
*/

export default api;
