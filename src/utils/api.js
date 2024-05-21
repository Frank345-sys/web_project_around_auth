class Api {
  constructor({ url, headers }) {
    this._baseUrl = url;
    this._headers = headers;
  }

  async get(complementUrl) {
    const result = await fetch(`${this._baseUrl}${complementUrl}`, {
      method: "GET",
      headers: this._headers,
    });
    if (!result.ok) {
      throw new Error(`Error: ${result.status}`);
    }
    return result.json();
  }

  async post(complementUrl, body) {
    const result = await fetch(`${this._baseUrl}${complementUrl}`, {
      method: "POST",
      headers: this._headers,
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
      headers: this._headers,
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
      headers: this._headers,
    });
    if (!result.ok) {
      throw new Error(`Error: ${result.status}`);
    }
    return result.json();
  }

  async put(complementUrl) {
    const result = await fetch(`${this._baseUrl}${complementUrl}`, {
      method: "PUT",
      headers: this._headers,
    });
    if (!result.ok) {
      throw new Error(`Error: ${result.status}`);
    }
    return result.json();
  }
}

const api = new Api({
  url: "https://around.nomoreparties.co/v1/web_es_08/",
  headers: {
    authorization: "28d1f77b-3605-449f-bf16-20a5216f8fdb",
    "Content-Type": "application/json",
  },
});

export default api;
