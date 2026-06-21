import { useState } from "react"
import RegisterPage from "../Sign-in/RegisterComponent"
import VerifyEmailPage from "../Sign-in/ConfirmationComponent"
import LoginPage from "../Sign-in/LoginComponent"
import "../aws"
type AuthView = "login" | "register" | "verify"

export default function Signin() {
  const [view, setView] = useState<AuthView>("login")
  const [pendingEmail, setPendingEmail] = useState("")

  if (view === "register") {
    return (
      <RegisterPage
        onSwitchToLogin={() => setView("login")}
        onRegistered={(email) => {
          setPendingEmail(email)
          setView("verify")
        }}
      />
    )
  }

  if (view === "verify") {
    return <VerifyEmailPage email={pendingEmail} onVerified={() => setView("login")} />
  }

  return <LoginPage onSwitchToRegister={() => setView("register")} />
}