const BASE = "";

export const createOrder = async (data) => {
  const r = await fetch("/api/orders", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });
  return r.json();
};

export const fbPixel = () => {};

const getToken = () => sessionStorage.getItem("faris_admin_token") || "";

export const adminLogin = async (password) => {
  const r = await fetch("/api/admin/auth", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({password})
  });
  const data = await r.json();
  if (data.token) {
    sessionStorage.setItem("faris_admin_token", data.token);
    return {token: data.token, success: true};
  }
  return {success: false};
};

export const getOrders = async () => {
  const r = await fetch("/api/admin/orders", {
    headers: {"x-admin-token": getToken()}
  });
  return r.json();
};

export const updateOrderStatus = async (id, status) => {
  const r = await fetch("/api/admin/orders/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": getToken()
    },
    body: JSON.stringify({status})
  });
  return r.json();
};

export const blockIP = async (ip, reason) => {
  const r = await fetch("/api/admin/block", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": getToken()
    },
    body: JSON.stringify({ ip, reason })
  });
  return r.json();
};

export const unblockIP = async (ip) => {
  const r = await fetch("/api/admin/block/" + ip, {
    method: "DELETE",
    headers: {"x-admin-token": getToken()}
  });
  return r.json();
};

export const getBlockedIPs = async () => {
  const r = await fetch("/api/admin/blocked", {
    headers: {"x-admin-token": getToken()}
  });
  return r.json();
};

export const getStats = async () => {
  const r = await fetch("/api/admin/stats", {
    headers: {"x-admin-token": getToken()}
  });
  return r.json();
};