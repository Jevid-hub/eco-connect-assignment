import { useState } from "react"
import { confirmSignUp } from "aws-amplify/auth"
import Header from "../Components/Header"
import Button from "../Components/Button"


type VerifyEmailPageProps = {
  email: string
  onVerified?: () => void
}

export default function VerifyEmailPage({ email, onVerified }: VerifyEmailPageProps) {
  const [token, setToken] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleVerifyEmail() {
    setError(null)
    setLoading(true)
    try {
      await confirmSignUp({ username: email, confirmationCode: token })
      onVerified?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Header title="Confirm Email" />

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <div className="flex flex-col gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter Verification Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#B5481F]"
            />
          </div>

          <Button
            label={loading ? "Verifying..." : "Verify"}
            variant="primary"
            onClick={handleVerifyEmail}
          />
        </div>
      </div>
    </div>
  )
}