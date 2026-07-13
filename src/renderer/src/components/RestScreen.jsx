import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { getRandomMessage } from '../utils/messages'

export default function RestScreen({ onComplete, onSkip, skipCount, isSoundEnabled }) {
    const [timeLeft, setTimeLeft] = useState(60)

    // 🔴 useEffect-এর বদলে সরাসরি এখানেই র‍্যান্ডম মেসেজ সেট করা হলো (Lazy Initialization)
    const [message] = useState(() => getRandomMessage())

    const audioRef = useRef(null)

    useEffect(() => {
        // সাউন্ড এনাবল থাকলে প্লে হবে
        if (isSoundEnabled && audioRef.current) {
            audioRef.current.volume = 0.4
            audioRef.current.play().catch((e) => console.log('Audio play blocked: ', e))
        }
    }, [isSoundEnabled])

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
            return () => clearInterval(timer)
        } else {
            // 🔴 Cascading render warning এড়াতে setTimeout ব্যবহার করা হলো
            const timeoutId = setTimeout(() => {
                onComplete()
            }, 0)
            return () => clearTimeout(timeoutId)
        }
    }, [timeLeft, onComplete])

    return (
        <div className="fixed inset-0 flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-slate-900/95 backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-slate-900/80"></div>

            {/* Relaxing Rain Sound */}
            <audio ref={audioRef} loop src="https://cdn.pixabay.com/audio/2021/08/09/audio_88447d76fb.mp3" />

            <div className="relative z-10 flex flex-col items-center text-center text-white">
                <div className="mb-12 min-h-[120px]">
                    <h1 className="whitespace-pre-line text-2xl font-light leading-relaxed text-pink-400 md:text-3xl">
                        {message.text}
                    </h1>
                </div>

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
                    <span className="z-10 text-6xl font-extralight text-white drop-shadow-lg">
                        {timeLeft}
                    </span>
                </div>

                <div className="mt-16 h-12">
                    {skipCount < 1 ? (
                        <button
                            onClick={onSkip}
                            className="cursor-pointer rounded-full border border-slate-600 bg-slate-800/50 px-6 py-2 text-sm text-slate-400 transition-all hover:bg-slate-700 hover:text-white"
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

RestScreen.propTypes = {
    onComplete: PropTypes.func.isRequired,
    onSkip: PropTypes.func.isRequired,
    skipCount: PropTypes.number.isRequired,
    isSoundEnabled: PropTypes.bool.isRequired
}