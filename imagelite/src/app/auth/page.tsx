"use client";

import { useEffect, useState, useMemo } from "react";
import { LoginForm, RegisterForm } from "./_components";

export default function Auth() {
  const searchParams = useMemo(() => new URLSearchParams(), []);
  const [isRegisterForm, setIsRegisterForm] = useState(false);

  useEffect(() => {
    if (searchParams.get("register")) {
      setIsRegisterForm(true);
    }
  }, [searchParams]);

  return (
    <>
      {isRegisterForm ? (
        <RegisterForm
          onSubmitSuccess={() => {
            setIsRegisterForm(false);

            searchParams.delete("register");
          }}
        >
          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => setIsRegisterForm(false)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login here
            </button>
          </p>
        </RegisterForm>
      ) : (
        <LoginForm>
          <p className="text-center text-sm text-gray-600">
            Don`t have an account?{" "}
            <button
              onClick={() => setIsRegisterForm(true)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Register here
            </button>
          </p>
        </LoginForm>
      )}
    </>
  );
}
