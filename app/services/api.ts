export const BASE_URL = process.env.HOSTNAME;

export const enpoints = {
  wallet: "/api/wallet",
};

async function get<T>(_url: string, queryString?: string): Promise<T> {
  const url = queryString ? `${_url}/?${queryString}` : _url;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

async function post<T, K>(url: string, data: K): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export const api = {
  get,
  post,
};
