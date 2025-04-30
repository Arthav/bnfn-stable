"use client";

import { title } from "@/components/primitives";
import { useState } from "react";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!oldPassword || !newPassword) {
      setError("Both fields are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("https://api-bnfn.vercel.app/api/zstf/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Password changed successfully!");
        // Reset form or do something else after successful password change
        setOldPassword('');
        setNewPassword('');
      } else {
        setError("Old password is incorrect.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-black rounded-lg shadow-lg">
      <h1 className={`${title()} text-2xl font-semibold text-center mb-6`}>Change Password</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Old Password */}
        <div className="space-y-2">
          <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Old Password</label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your old password"
          />
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your new password"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Submit Button */}
        <div>
          <button 
            type="submit" 
            className={`w-full p-3 text-white rounded-md ${isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} focus:outline-none`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
