import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useAuthForm<T extends { email: string; password: string }>(
  initialData: T,
  submitAction: (data: T) => Promise<void>,
  redirectPath?: string,
  validatePassword: boolean = true
) {
  const [formData, setFormData] = useState<T>(initialData);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);
      try {
        if (validatePassword && formData.password.length < 8) {
          throw new Error("Password must be at least 8 characters long");
        }
        await submitAction(formData);
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("returnTo") || redirectPath || "/";
        router.push(redirect);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Operation failed. Please try again.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, submitAction, redirectPath, validatePassword, router]
  );

  return {
    form: { data: formData, setData: setFormData, error, isLoading },
    handlers: { change: handleChange, submit: handleSubmit, toggleShowPassword },
    password: { show: showPassword },
  };
}