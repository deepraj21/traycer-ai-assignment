import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Authentication = () => {
    return (
        <div className="space-y-4">

            <div>
                <span className="text-3xl">traycer</span>
            </div>

            <form className="space-y-5">
                <div className="space-y-4">
                    <div className="*:not-first:mt-2">
                        <Label >Email</Label>
                        <Input
                            placeholder="hi@yourcompany.com"
                            type="email"
                            required
                        />
                    </div>
                    <div className="*:not-first:mt-2">
                        <Label>Password</Label>
                        <Input
                            placeholder="Enter your password"
                            type="password"
                            required
                        />
                    </div>
                </div>
                <Button type="button" className="w-full">
                    Continue to traycer
                </Button>
            </form>

            <p className="text-muted-foreground text-center text-xs">
                By signing up you agree to our{" "}
                <Link className="underline" to="/">
                    Terms
                </Link>
                .
            </p>
        </div>
    )
}

export default Authentication