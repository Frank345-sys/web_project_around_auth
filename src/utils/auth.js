//export const BASE_URL = "https://register.nomoreparties.co";
//export const BASE_URL = "http://localhost:3000";
export const BASE_URL = "https://api.around-project.mega-link.cl";
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const register = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        throw new Error(data.error);
      }
    });
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**/
export const authorize = (password, email) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        throw new Error(data.message);
      } else if (data.token) {
        localStorage.setItem("jwt", data.token);
      }
    });
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => data);
};
