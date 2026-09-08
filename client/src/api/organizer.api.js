import http from "./http";

export const createEvent = async (eventData) => {
  const response = await http.post("/events", eventData);
  const payload = response.data?.data ?? response.data;

  return payload?.event ?? payload;
};

export const getOrganizerEvents = async () => {
  const response = await http.get("/events/organizer/my-events");

  const payload = response.data?.data ?? response.data;

  if (Array.isArray(payload)) {
    return payload;
  }
  return payload?.events ?? [];
};

export const getEventAttendees = async (eventId) => {
  const response = await http.get(`/events/${eventId}/attendees`);

  const payload = response.data?.data ?? response.data;

  if (Array.isArray(payload)) {
    return {
      attendees: payload,
      summary: null,
    };
  }

  return {
    attendees: payload?.attendees ?? [],
    summary: payload?.summary ?? null,
  };
};
