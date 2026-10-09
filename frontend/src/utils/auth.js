const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }

  return Promise.reject(`Erro: ${res.status}`);
};

export const register = (email, password) => fetch(
  `${BASE_URL}/signup`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  },
).then(checkResponse);

export const login = (email, password) => fetch(
  `${BASE_URL}/signin`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  },
).then(checkResponse);

export const checkToken = (token) => fetch(
  `${BASE_URL}/users/me`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
).then(checkResponse);