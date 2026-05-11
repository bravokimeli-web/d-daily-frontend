import { useState } from "react";
import { setAdminEmail, ADMIN_EMAIL_PUBLIC } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const trimmedEmail = email.toLowerCase().trim();
    if (trimmedEmail === ADMIN_EMAIL_PUBLIC) {
      setAdminEmail(trimmedEmail);
      setMessage({
        type: "success",
        text: "Admin access granted. Redirecting...",
      });
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1500);
    } else {
      setMessage({
        type: "error",
        text: "Invalid email. Please check and try again.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="admin-email" className="text-sm font-medium">
            Admin Email
          </label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter admin email"
            className="mt-2 w-full h-11 px-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
        </div>

        {message && (
          <div
            className={`flex items-start gap-2 rounded-lg p-3 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Verifying..." : "Verify Admin Access"}
        </Button>
      </form>
    </div>
  );
}
