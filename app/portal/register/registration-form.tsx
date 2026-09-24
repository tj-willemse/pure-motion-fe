"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { register } from "@/app/auth/actions";

const passwordChecks = [
  (value: string) => value.length >= 10,
  (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value),
  (value: string) => /\d/.test(value),
  (value: string) => /[^A-Za-z0-9]/.test(value),
];

const strengthLabels = ["Very weak", "Weak", "Fair", "Good", "Strong"];

export function RegistrationForm({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const strength = passwordChecks.filter((check) => check(password)).length;

  return (
    <form action={register}>
      <label htmlFor="firstName">First name</label>
      <input id="firstName" name="firstName" type="text" autoComplete="given-name" required />
      <label htmlFor="lastName">Surname</label>
      <input id="lastName" name="lastName" type="text" autoComplete="family-name" required />
      <label htmlFor="email">Email address</label>
      <input id="email" name="email" type="email" autoComplete="email" required />
      <label htmlFor="password">Password</label>
      <div className="password-field">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          minLength={10}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-describedby={password ? "password-strength password-requirements" : undefined}
          required
        />
        <button
          className="password-toggle"
          type="button"
          onClick={() => setShowPassword((visible) => !visible)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {password && (
        <div className="password-feedback">
          <div className="password-strength-heading" id="password-strength" aria-live="polite">
            <span>Password strength</span>
            <strong>{strengthLabels[strength]}</strong>
          </div>
          <div
            className="password-strength-meter"
            role="progressbar"
            aria-label="Password strength"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={strength}
          >
            {[1, 2, 3, 4].map((step) => (
              <span key={step} className={strength >= step ? "is-active" : ""} />
            ))}
          </div>
          <p id="password-requirements">
            Use 10 or more characters with uppercase and lowercase letters, a number and a symbol.
          </p>
        </div>
      )}
      <label htmlFor="confirmPassword">Confirm password</label>
      <div className="password-field">
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmation ? "text" : "password"}
          autoComplete="new-password"
          minLength={10}
          required
        />
        <button
          className="password-toggle"
          type="button"
          onClick={() => setShowConfirmation((visible) => !visible)}
          aria-label={showConfirmation ? "Hide confirmation password" : "Show confirmation password"}
          aria-pressed={showConfirmation}
        >
          {showConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <button className="button" type="submit" disabled={!configured}>
        Create account <ArrowRight size={18} />
      </button>
    </form>
  );
}
