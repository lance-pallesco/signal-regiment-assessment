import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signal Regiment PIMS | Philippine Army Login",
  description:
    "Personnel Information Management System for the Signal Regiment, Philippine Army.",
};

export default function RootLoginPage() {
  return <LoginForm />;
}
