import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

export default function RestScreen({ onComplete, onSkip, skipCount }) {
    const [timeLeft, setTimeLeft] = useState(60)

    useEffect(() => {
        // 60 সেকেন্ডের কাউন্টডাউন টাইমার
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
            return () => clearInterval(timer)
        } else {
            // 0 হলে অটোমেটিক Rest Mode শেষ হবে
            onComplete()
        }
    }, [timeLeft, onComplete])

    return (
        <div className="fixed inset-0 flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-slate-900/95 backdrop-blur-md">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-slate-900/80"></div>

            <div className="relative z-10 flex flex-col items-center text-center text-white">
                <h1 className="mb-4 text-3xl font-light text-pink-400">❤️ চোখ বন্ধ করো...</h1>
                <p className="mb-12 text-xl font-light text-slate-300">একটু বিশ্রাম নাও।</p>

                {/* Breathing Circle Animation */}
                <div className="relative flex h-64 w-64 items-center justify-center">
                    <motion.div
                        className="absolute h-48 w-48 rounded-full bg-pink-500/20 blur-xl"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute h-32 w-32 rounded-full border border-pink-400/30 bg-pink-500/10 backdrop-blur-sm"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* Countdown Number */}
                    <span className="z-10 text-6xl font-extralight text-white drop-shadow-lg">
                        {timeLeft}
                    </span>
                </div>

                <p className="mt-12 text-lg text-slate-400">ধীরে ধীরে শ্বাস নাও... ধীরে ছাড়ো।</p>

                {/* Emergency Skip Button Logic */}
                <div className="mt-16 h-12">
                    {skipCount < 1 ? (
                        <button
                            onClick={onSkip}
                            className="rounded-full cursor-pointer border border-slate-600 bg-slate-800/50 px-6 py-2 text-sm text-slate-400 transition-all hover:bg-slate-700 hover:text-white cursor-pointer"
                        >
                            Skip Once (Emergency)
                        </button>
                    ) : (
                        <p className="text-sm text-pink-500/70">
                            তুমি ইতিমধ্যে একবার স্কিপ করেছো। এবার চোখের বিশ্রাম জরুরি।
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

// PropTypes Validation যোগ করা হলো
RestScreen.propTypes = {
    onComplete: PropTypes.func.isRequired,
    onSkip: PropTypes.func.isRequired,
    skipCount: PropTypes.number.isRequired
}
