"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { User } from "@/resources/user/user.resource";
import { useAuth } from "@/resources";

interface RegisterFormProps {
  children: React.ReactNode;
  onSubmitSuccess: () => void;
}

const registerSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

type FormErrors = {
  [K in keyof RegisterFormData]?: string[];
};

export default function RegisterForm({
  children,
  onSubmitSuccess,
}: RegisterFormProps) {
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const auth = useAuth;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setFormErrors({});

      // Validate the data using Zod before submission
      const user: User = registerSchema.parse(data);

      try {
        await auth.save(user);

        toast({
          title: "✅ Account created",
          description: "You can now log in to your account",
        });

        reset();

        setTimeout(() => {
          onSubmitSuccess();
        }, 250);
      } catch (error: any) {
        setError("root", {
          type: "error",
          message: error?.message,
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        const errors: FormErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof RegisterFormData;
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path]?.push(err.message);
        });
        setFormErrors(errors);
      } else {
        // Handle other errors
        const errorMessage =
          error instanceof Error ? error.message : "Registration failed";
        toast({
          title: "❌ Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                disabled={loading}
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.name.message}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                disabled={loading}
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <small className="text-red-500">{errors.email.message}</small>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                disabled={loading}
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <small className="text-red-500">
                  {errors.password.message}
                </small>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                disabled={loading}
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <small className="text-red-500">
                  {errors.confirmPassword.message}
                </small>
              )}
            </div>
            {errors.root && (
              <small className="text-red-500">{errors.root.message}</small>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">{children}</CardFooter>
      </Card>
    </div>
  );
}
