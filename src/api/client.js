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

export const adminLogin = async (data) => {
  const token = "faris_admin_" + data.password;
  const r = await fetch("/api/admin/orders", {
    headers: {"x-admin-token": token}
  });
  if (r.ok) {
    localStorage.setItem("adminPass", token);
    return {success: true};
  }
  return {success: false};
};

export const getOrders = async () => {
  const r = await fetch("/api/admin/orders", {
    headers: {"x-admin-token": localStorage.getItem("adminPass") || ""}
  });
  return r.json();
};

export const updateOrderStatus = async (id, status) => {
  const r = await fetch("/api/admin/orders/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": localStorage.getItem("adminPass") || ""
    },
    body: JSON.stringify({status})
  });
  return r.json();
};

export const blockIP = async (ip) => {
  const r = await fetch("/api/admin/block", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": localStorage.getItem("adminPass") || ""
    },
    body: JSON.stringify({ip})
  });
  return r.json();
};

export const unblockIP = async (ip) => {
  const r = await fetch("/api/admin/block/" + ip, {
    method: "DELETE",
    headers: {"x-admin-token": localStorage.getItem("adminPass") || ""}
  });
  return r.json();
};

export const getBlockedIPs = async () => {
  const r = await fetch("/api/admin/blocked", {
    headers: {"x-admin-token": localStorage.getItem("adminPass") || ""}
  });
  return r.json();
};

export const getStats = async () => {
  const r = await fetch("/api/admin/stats", {
    headers: {"x-admin-token": localStorage.getItem("adminPass") || ""}
  });
  return r.json();
};