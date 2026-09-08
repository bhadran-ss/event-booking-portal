import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AuthLayout from "../../components/auth/AuthLayout";
import FormField from "../../components/auth/FormField";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { getApiError } from "../../utils/getApiError";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "CUSTOMER",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (formData.password.length < 6) {
      nextErrors.password = "Password must contain at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      });

      toast.success("Account created successfully.");

      if (response?.token && response?.user) {
        const destination =
          response.user.role === "ORGANIZER" ? "/organizer/events" : "/events";

        navigate(destination, { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join as a customer or start organizing events."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          id="name"
          name="name"
          type="text"
          label="Full name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
        />

        <FormField
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <div>
          <label
            htmlFor="role"
            className="mb-1.5 block text-sm font-medium text-slate-500"
          >
            Account type
          </label>

          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-600 focus:ring-4 focus:ring-slate-200 "
          >
            <option
              className="text-slate-900 focus:bg-slate-500"
              value="CUSTOMER"
            >
              Customer
            </option>
            <option
              className="text-slate-900 focus:bg-slate-500"
              value="ORGANIZER"
            >
              Organizer
            </option>
          </select>
        </div>

        <FormField
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Minimum 6 characters"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />

        <FormField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="Enter password again"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-600 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <LoadingSpinner size="sm" />}
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-slate-600 hover:text-slate-700"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
