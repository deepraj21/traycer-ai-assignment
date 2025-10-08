import { ChevronLeft } from "lucide-react"
import { Button } from "../ui/button"

const Hero = () => {
    return (
        <div className="flex md:flex-row flex-col md:gap-24 gap-8 w-full">
            <div className="text-6xl">
                The real AI Engineer <br />
                Collaborate with <br /> Intelligence
            </div>
            <div className="flex flex-col gap-4">
                <div>
                    Plan. Execute. Deliver.<br />
                    <span className="font-semibold">traycer</span> is your 10x AI Engineer who can independently build<br /> software solutions for you.
                </div>
                <div className="flex gap-4">
                    <Button className="h-10" size="lg">Download traycer</Button>
                    <Button className="h-10" variant="outline">Continue Web version</Button>
                </div>
                <span className="flex items-center cursor-pointer underline"><ChevronLeft size="16" />all downloads</span>
            </div>
        </div>
    )
}

export default Hero