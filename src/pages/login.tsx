import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plane } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-800 to-primary-950 p-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white mb-4">
          <Plane size={32} className="text-primary-700" />
        </div>
        <h1 className="text-3xl font-bold text-white">TripsOffice</h1>
      </div>

      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader>
          <CardTitle className="text-center">Inicio de sesión</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-danger-50 text-danger-700 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              autoComplete="email"
              {...register("email")}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              error={errors.password?.message}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-primary-100">
        Demo logins:
        <br />
        <code className="bg-primary-700/50 px-2 py-1 rounded text-white">
          admin@tripsoffice.com / admin123
        </code>
        <br />
        <code className="bg-primary-700/50 px-2 py-1 rounded text-white">
          sales@tripsoffice.com / sales123
        </code>
        <br />
      </p>
    </div>
  );
}
