import { useState } from "react"
import { signUp } from "aws-amplify/auth"
import Header from "../Components/Header"
import Button from "../Components/Button"

type RegisterPageProps = {
  onSwitchToLogin?: () => void
  onRegistered?: (email: string) => void
}

export default function RegisterPage({ onSwitchToLogin, onRegistered }: RegisterPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    setError(null)
    setLoading(true)
    try {
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      })
      onRegistered?.(email)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="flex justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Header title="Register" />

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <div className="flex flex-col gap-4 mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#B5481F]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#B5481F]"
            />
          </div>

          <Button
            label={loading ? "Submitting..." : "Submit"}
            variant="primary"
            onClick={handleRegister}
          />

          <p className="mt-4 flex justify-start gap-2 text-sm text-gray-700">
            <button onClick={onSwitchToLogin} className="font-semibold text-[#B5481F] underline">
              Login!
            </button>{" "}
            Login in your existing account
          </p>
        </div>
      </div>
    </div>
  )
}