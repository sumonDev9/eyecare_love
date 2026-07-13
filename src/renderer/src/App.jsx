import { useState } from 'react'
import RestScreen from './components/RestScreen'

function App() {
  // অ্যাপটি Rest Mode-এ আছে কি না, তার স্টেট
  const [isResting, setIsResting] = useState(false)
  // ইউজার কতবার স্কিপ করেছে, তার ট্র্যাক
  const [skipCount, setSkipCount] = useState(0)

  // Rest Mode ম্যানুয়ালি টেস্ট করার ফাংশন
  const handleTestRest = () => {
    setIsResting(true)
    // Main Process-কে ফুলস্ক্রিন করার সিগন্যাল পাঠানো
    window.api?.startRestMode()
  }

  // Rest Mode শেষ হলে আবার নরমাল অবস্থায় ফেরার ফাংশন
  const handleRestComplete = () => {
    setIsResting(false)
    setSkipCount(0) // সফলভাবে ব্রেক নিলে স্কিপ কাউন্ট রিসেট হয়ে যাবে
    window.api?.endRestMode()
  }

  // ইমার্জেন্সি স্কিপ ফাংশন
  const handleSkip = () => {
    if (skipCount < 1) {
      setSkipCount((prev) => prev + 1)
      setIsResting(false)
      window.api?.endRestMode()
    }
  }

  // যদি Rest Mode চালু থাকে, তাহলে RestScreen দেখাবে
  if (isResting) {
    return <RestScreen onComplete={handleRestComplete} onSkip={handleSkip} skipCount={skipCount} />
  }

  // নরমাল Settings বা Home Screen (System Tray থেকে ওপেন করলে যা দেখাবে)
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="mb-4 text-4xl font-bold text-pink-500">❤️ EyeCare Love</h1>
      <p className="mb-8 text-slate-400">Settings will be here...</p>

      {/* টেস্টিংয়ের জন্য এই বাটনটি রাখা হলো */}
      <button
        onClick={handleTestRest}
        className="rounded-lg bg-pink-600 px-6 py-3 font-semibold text-white shadow-lg shadow-pink-500/30 transition-all hover:bg-pink-500"
      >
        Test Rest Mode Now
      </button>
    </div>
  )
}

export default App
