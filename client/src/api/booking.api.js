import http from "./http";

export const bookEvent = async (eventId, requestedTickets) => {
  const response = await http.post(`/events/${eventId}/book`, {
    requestedTickets,
  });

  return response.data?.data ?? response.data;
};
