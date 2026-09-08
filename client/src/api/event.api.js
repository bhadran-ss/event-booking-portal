import http from "./http";

export const getEvents = async ({ category = "", search = "" } = {}) => {
  const params = {};

  if (category) {
    params.category = category;
  }

  if (search.trim()) {
    params.search = search.trim();
  }

  const response = await http.get("/events", { params });

  const payload = response.data?.data ?? response.data;

  if (Array.isArray(payload)) {
    return payload;
  }

  return payload?.events ?? [];
};

export const getEventById = async (eventId) => {
  const response = await http.get(`/events/${eventId}`);
  const payload = response.data?.data ?? response.data;

  return payload?.event ?? payload;
};
