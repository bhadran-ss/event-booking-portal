import { useState } from "react";
import { toast } from "react-toastify";

import { createEvent } from "../../api/organizer.api";
import { getApiError } from "../../utils/getApiError";
import LoadingSpinner from "../common/LoadingSpinner";

const initialFormData = {
  title: "",
  description: "",
  category: "Tech",
  date: "",
  location: "",
  ticketPrice: "",
  totalTickets: "",
};

const categories = ["Music", "Tech", "Workshop", "Sports", "Other"];

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200";

const getMinimumDateTime = () => {
  const date = new Date(Date.now() + 5 * 60 * 1000);
  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60 * 1000)
    .toISOString()
    .slice(0, 16);
};

export default function CreateEventForm({ onCreated }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.date ||
      !formData.location.trim() ||
      formData.ticketPrice === "" ||
      formData.totalTickets === ""
    ) {
      toast.error("Please complete all event fields.");
      return false;
    }

    const selectedDate = new Date(formData.date);

    if (Number.isNaN(selectedDate.getTime()) || selectedDate <= new Date()) {
      toast.error("Event date must be in the future.");
      return false;
    }

    if (Number(formData.ticketPrice) < 0) {
      toast.error("Ticket price cannot be negative.");
      return false;
    }

    if (
      !Number.isInteger(Number(formData.totalTickets)) ||
      Number(formData.totalTickets) < 1
    ) {
      toast.error("Total tickets must be a whole number of at least 1.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();


    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createEvent({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        date: new Date(formData.date).toISOString(),
        location: formData.location.trim(),
        ticketPrice: Number(formData.ticketPrice),
        totalTickets: Number(formData.totalTickets),
      });

      toast.success("Event created successfully.");
      setFormData(initialFormData);

      await onCreated();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(getApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-xl font-bold text-slate-900">Create Event</h2>

      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="title"
            className="text-sm font-semibold text-slate-700"
          >
            Event title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter event title"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-sm font-semibold text-slate-700"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`${inputClass} min-h-24 resize-y`}
            placeholder="Describe the event"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="text-sm font-semibold text-slate-700"
          >
            Category
          </label>

          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClass}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="date"
            className="text-sm font-semibold text-slate-700"
          >
            Date and time
          </label>

          <input
            id="date"
            name="date"
            type="datetime-local"
            value={formData.date}
            onChange={handleChange}
            min={getMinimumDateTime()}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="text-sm font-semibold text-slate-700"
          >
            Location
          </label>

          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter venue or location"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="ticketPrice"
              className="text-sm font-semibold text-slate-700"
            >
              Ticket price
            </label>

            <input
              id="ticketPrice"
              name="ticketPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.ticketPrice}
              onChange={handleChange}
              className={inputClass}
              placeholder="0"
              required
            />
          </div>

          <div>
            <label
              htmlFor="totalTickets"
              className="text-sm font-semibold text-slate-700"
            >
              Total tickets
            </label>

            <input
              id="totalTickets"
              name="totalTickets"
              type="number"
              min="1"
              step="1"
              value={formData.totalTickets}
              onChange={handleChange}
              className={inputClass}
              placeholder="1"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <LoadingSpinner size="sm" />}

          {isSubmitting ? "Creating event..." : "Create Event"}
        </button>
      </div>
    </form>
  );
}
