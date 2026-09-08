const API_BASE_URL = (
  process.env.API_BASE_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const credentials = {
  organizer: {
    email: process.env.ORGANIZER_EMAIL,
    password: process.env.ORGANIZER_PASSWORD,
  },
  customerOne: {
    email: process.env.CUSTOMER_ONE_EMAIL,
    password: process.env.CUSTOMER_ONE_PASSWORD,
  },
  customerTwo: {
    email: process.env.CUSTOMER_TWO_EMAIL,
    password: process.env.CUSTOMER_TWO_PASSWORD,
  },
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const apiRequest = async (path, { method = "GET", token, body } = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
    ...(body
      ? {
          body: JSON.stringify(body),
        }
      : {}),
  });

  let responseBody = null;

  try {
    responseBody = await response.json();
  } catch {
    responseBody = null;
  }

  return {
    ok: response.ok,
    status: response.status,
    body: responseBody,
  };
};

const login = async ({ email, password }, accountName) => {
  assert(email, `${accountName} email is missing.`);
  assert(password, `${accountName} password is missing.`);

  const result = await apiRequest("/auth/login", {
    method: "POST",
    body: {
      email,
      password,
    },
  });

  assert(
    result.ok,
    `${accountName} login failed with status ${result.status}: ${
      result.body?.message || "Unknown error"
    }`,
  );

  const token = result.body?.data?.token;

  assert(token, `${accountName} login did not return a token.`);

  return token;
};

const createTestEvent = async (organizerToken) => {
  const eventDate = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const result = await apiRequest("/events", {
    method: "POST",
    token: organizerToken,
    body: {
      title: `Concurrency Test ${Date.now()}`,
      description:
        "Temporary event created to verify that simultaneous booking requests cannot cause ticket overbooking.",
      category: "Tech",
      date: eventDate,
      location: "Concurrency Test Venue",
      ticketPrice: 100,
      totalTickets: 5,
    },
  });

  assert(
    result.ok,
    `Unable to create test event. Status ${result.status}: ${
      result.body?.message || "Unknown error"
    }`,
  );

  const event = result.body?.data?.event;

  assert(event?._id, "Create event response has no event ID.");
  assert(
    event.availableTickets === 5,
    "Test event did not start with 5 available tickets.",
  );

  return event;
};

const getCustomerBookings = async (token) => {
  const result = await apiRequest("/bookings/my-bookings", {
    token,
  });

  assert(
    result.ok,
    `Unable to retrieve customer bookings. Status ${result.status}`,
  );

  return result.body?.data?.bookings ?? [];
};

const runTest = async () => {
  console.log("Starting concurrency test...");

  const [organizerToken, customerOneToken, customerTwoToken] =
    await Promise.all([
      login(credentials.organizer, "Organizer"),
      login(credentials.customerOne, "Customer one"),
      login(credentials.customerTwo, "Customer two"),
    ]);

  console.log("All test users authenticated.");

  const event = await createTestEvent(organizerToken);

  console.log(`Created event: ${event._id}`);
  console.log("Available tickets before booking: 5");
  console.log("Sending two simultaneous requests for 4 tickets each...");

  const bookingRequest = (token) =>
    apiRequest(`/events/${event._id}/book`, {
      method: "POST",
      token,
      body: {
        requestedTickets: 4,
      },
    });

  const [firstResult, secondResult] = await Promise.all([
    bookingRequest(customerOneToken),
    bookingRequest(customerTwoToken),
  ]);

  const results = [firstResult, secondResult];
  const successfulResults = results.filter((result) => result.status === 201);

  const rejectedResults = results.filter((result) => result.status === 409);

  console.log(
    `Booking response statuses: ${firstResult.status}, ${secondResult.status}`,
  );

  assert(
    successfulResults.length === 1,
    `Expected exactly one successful booking, but received ${successfulResults.length}.`,
  );

  assert(
    rejectedResults.length === 1,
    `Expected exactly one 409 rejection, but received ${rejectedResults.length}.`,
  );

  const eventResult = await apiRequest(`/events/${event._id}`);

  assert(eventResult.ok, "Unable to retrieve event after booking.");

  const updatedEvent = eventResult.body?.data?.event;

  assert(
    updatedEvent?.availableTickets === 1,
    `Expected 1 remaining ticket, but found ${updatedEvent?.availableTickets}.`,
  );

  const [customerOneBookings, customerTwoBookings] = await Promise.all([
    getCustomerBookings(customerOneToken),
    getCustomerBookings(customerTwoToken),
  ]);

  const matchingBookings = [
    ...customerOneBookings,
    ...customerTwoBookings,
  ].filter((booking) => {
    const bookingEventId = booking.event?._id ?? booking.event;

    return (
      String(bookingEventId) === String(event._id) &&
      booking.bookingStatus === "CONFIRMED"
    );
  });

  assert(
    matchingBookings.length === 1,
    `Expected exactly one Booking document, but found ${matchingBookings.length}.`,
  );

  const attendeesResult = await apiRequest(`/events/${event._id}/attendees`, {
    token: organizerToken,
  });

  assert(
    attendeesResult.ok,
    "Unable to retrieve attendees for the test event.",
  );

  const attendees = attendeesResult.body?.data?.attendees ?? [];

  assert(
    attendees.length === 1,
    `Expected one attendee, but found ${attendees.length}.`,
  );

  assert(
    attendees[0].ticketsBooked === 4,
    `Expected the attendee to have 4 tickets, but found ${attendees[0].ticketsBooked}.`,
  );

  console.log("");
  console.log("CONCURRENCY TEST PASSED");
  console.log("Exactly one booking succeeded.");
  console.log("Exactly one booking was rejected.");
  console.log("Final available tickets: 1");
  console.log("Confirmed booking records: 1");
  console.log("Attendee records: 1");
  console.log(`Test event ID: ${event._id}`);
};

runTest().catch((error) => {
  console.error("");
  console.error("CONCURRENCY TEST FAILED");
  console.error(error.message);

  process.exitCode = 1;
});
