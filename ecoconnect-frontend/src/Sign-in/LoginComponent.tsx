import { useState } from "react"
import { signIn } from "aws-amplify/auth"
import Header from "../Components/Header"
import Button from "../Components/Button"
import { useNavigate } from "react-router-dom"

type LoginPageProps = {
  onSwitchToRegister?: () => void

}

export default function LoginPage({ onSwitchToRegister,  }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
const nav = useNavigate();
  async function handleLogin() {
    setError(null)
    setLoading(true)
    try {
      await signIn({ username: email, password })
      nav('/profile')
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Header title="Login" />

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
            label={loading ? "Logging in..." : "Submit"}
            variant="primary"
            onClick={handleLogin}
          />

          <p className="mt-4 flex justify-start gap-2 text-sm text-gray-700">
            <button onClick={onSwitchToRegister} className="font-semibold text-[#B5481F] underline">
              Register!
            </button>{" "}
            Register new account
          </p>
        </div>
      </div>
    </div>
  )
}