"use client";
import React, { useState } from "react";

export default function MassageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [password, setPassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [showModal, setShowModal] = useState(true); // Initially show the modal
  const [isLoadingPass, setIsLoadingPass] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoadingPass(true);
        // Make the POST request to check the password
        const response = await fetch('https://api-bnfn.vercel.app/api/zstf/checkPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password })
        });

        // Parse the JSON response
        const data = await response.json();

        if (data.success) {
            setIsPasswordCorrect(true);
            setShowModal(false);
        } else {
            alert("Incorrect password, please try again.");
        }
    } catch (error) {
        console.error('Error checking password:', error);
        alert("An error occurred. Please try again.");
    }
    finally {
      setIsLoadingPass(false);
    }
};

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-2 md:py-2">
      <main className="container mx-auto max-w-7xl flex-grow">
        {/* Password Modal */}
        {showModal && !isPasswordCorrect && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4 text-white">Enter Password</h2>
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                    Password:
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    disabled={isLoadingPass}
                  >
                    {isLoadingPass ? "Verifying..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content (children) */}
        {isPasswordCorrect && <>{children}</>}
      </main>
    </section>
  );
}
