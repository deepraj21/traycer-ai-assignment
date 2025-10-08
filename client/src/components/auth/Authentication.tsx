import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/context/auth-context"

const Authentication = () => {
    const navigate = useNavigate()
    const { signup, signin } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mode, setMode] = useState<"signup" | "signin">("signup")
    const [submitting, setSubmitting] = useState(false)


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            if (mode === "signup") {
                await signup(email, password)
                setMode("signin")
                toast.success("Account created. Please sign in.")
            } else {
                await signin(email, password)
                toast.success("Signed in successfully")
                navigate("/")
            }
        } catch (err: any) {
            const status = err?.response?.status
            const apiMessage = err?.response?.data?.message
            if (!status) {
                toast.error("Network error. Please check your connection.")
                return
            }
            switch (status) {
                case 400:
                    toast.error(apiMessage || "Email and password are required")
                    break
                case 401:
                    toast.error(apiMessage || "Invalid credentials")
                    break
                case 409:
                    toast.error(apiMessage || "User already exists. Please sign in")
                    break
                case 500:
                    toast.error(apiMessage || "Server error. Please try again later")
                    break
                default:
                    toast.error(apiMessage || "Something went wrong")
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="space-y-4">

            <div>
                <span className="text-3xl">traycer</span>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="*:not-first:mt-2">
                        <Label >Email</Label>
                        <Input
                            placeholder="hi@yourcompany.com"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="*:not-first:mt-2">
                        <Label>Password</Label>
                        <Input
                            placeholder="Enter your password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                    {mode === "signup" ? (
                        submitting ? (
                            <span className="inline-flex items-center gap-2">
                                <Spinner />
                                Creating account...
                            </span>
                        ) : (
                            "Sign up"
                        )
                    ) : (
                        submitting ? (
                            <span className="inline-flex items-center gap-2">
                                <Spinner />
                                Signing in...
                            </span>
                        ) : (
                            "Sign in"
                        )
                    )}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                    {mode === "signup" ? (
                        <span>Already have an account? <button type="button" className="underline cursor-pointer" onClick={() => setMode("signin")}>Sign in</button></span>
                    ) : (
                        <span>New here? <button type="button" className="underline cursor-pointer" onClick={() => setMode("signup")}>Create account</button></span>
                    )}
                </div>
            </form>
        </div>
    )
}

export default Authentication