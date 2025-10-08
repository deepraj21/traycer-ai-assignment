import Hero from "@/components/hero/Hero"
import { Navbar } from "@/components/layout/Navbar"
import GradientBlinds from "@/components/ui/GradientBlinds"

const Landing = () => {
    return (
        <>
            <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
                <GradientBlinds
                    gradientColors={['#FF9FFC', '#5227FF']}
                    angle={139}
                    noise={0.5}
                    blindCount={16}
                    blindMinWidth={60}
                    spotlightRadius={0.5}
                    spotlightSoftness={1}
                    spotlightOpacity={1}
                    mouseDampening={0.15}
                    distortAmount={0}
                    shineDirection="left"
                    mixBlendMode="lighten"
                />
            </div>
            <div className="p-4">
                <Navbar />
                <div className="flex flex-row min-h-[calc(100vh-70px)] items-end">
                    <Hero />
                </div>
            </div>
        </>

    )
}

export default Landing