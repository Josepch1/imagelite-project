"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/resources";
import { AccessToken, Credentials } from "@/resources/user/user.resource";

interface LoginFormProps {
  children: React.ReactNode;
}

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormData = z.infer<typeof LoginSchema>;

type FormErrors = {
  [K in keyof LoginFormData]?: string[];
};

export default function LoginForm({ children }: LoginFormProps) {
  const router = useRouter();
  const auth = useAuth;

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setFormErrors({});

      // Validate the data using Zod before submission
      const credentials: Credentials = LoginSchema.parse(data);

      try {
        const accessToken: AccessToken = await auth.authenticate(credentials);

        // Store the access token in local storage
        auth.initSession(accessToken);

        const userSession = auth.getUserSession();

        toast({
          title: `🎉 Welcome back, ${userSession?.name?.split(` `)[0]}!`,
          description: "You have successfully logged in.",
        });

        reset();
        router.push("/galeria");

        return;
      } catch (error: any) {
        setError("root", {
          message: error?.message,
        });

        toast({
          title: "Error",
          description: error?.message,
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        const errors: FormErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof LoginFormData;
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path]?.push(err.message);
        });
        setFormErrors(errors);
      } else {
        // Handle other errors
        setError("root", {
          message: "Invalid credentials. Please try again.",
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
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {errors.root && (
              <small className="text-red-500">{errors.root.message}</small>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">{children}</CardFooter>
      </Card>
    </div>
  );
}
