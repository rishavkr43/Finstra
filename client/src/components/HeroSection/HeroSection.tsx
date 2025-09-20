'use client'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

const HeroSection: React.FC = () => {

    const router = useRouter()
    return (
        <>
            <div id="about" className="flex flex-col lg:flex-row items-center gap-10 py-12">
                <div className="lg:w-1/2">
                    <h1 className="text-3xl font-extrabold mb-4">
                        Financial Empowerment for Farmers
                        <br />
                        <span className="text-green-700 text-xl block mt-2">
                            With Finstra, you can navigate finance in a more intelligent and secure way.
                        </span>
                    </h1>
                    <p className="text-gray-400">
                        Finstra aims to provide uncomplicated, transparent, and reliable financial advice to millions of farmers.
                        This assistance helps them comprehend schemes such as KCC, safeguard against fraud, and make assured choices
                        regarding savings and investments.
                    </p>
                    <div className='my-4 flex gap-4'>
                        <Button
                            onClick={() => router.push("/chat")}
                            className='cursor-pointer bg-green-700 hover:bg-green-600'
                        >Get Started</Button>
                        <Button
                            onClick={() => window.open('https://rishavkr43.github.io/Finstra/Frontend_vc/index.html', '_blank')}
                            // onClick={() => window.open('https://6838b1ef95a674a9b1f6b231--tubular-lolly-3dc7d3.netlify.app/', '_blank')}
                            className='cursor-pointer bg-green-700 hover:bg-green-600'
                        >Get Started with Voice Chat</Button>
                    </div>
                </div>
                <div className="lg:w-1/2">
                    <video src={`/assets/finstra-guide.mp4`} autoPlay loop muted className="w-full rounded-lg shadow-lg" />
                </div>
            </div>
        </>
    )
}

export default HeroSection