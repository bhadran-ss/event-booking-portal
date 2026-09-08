import http from "./http";

export const bookEvent = async (eventId, requestedTickets) => {
  const response = await http.post(`/events/${eventId}/book`, {
    requestedTickets,
  });

  return response.data?.data ?? response.data;
};

export const getMyBookings = async () => {
  const response = await http.get("/bookings/my-bookings");

  const payload = response.data?.data ?? response.data;

  if (Array.isArray(payload)) {
    return payload;
  }

  return payload?.bookings ?? [];
};
