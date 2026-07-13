import { useState, useEffect } from 'react'
import RestScreen from './components/RestScreen'

function App() {
  // LocalStorage থেকে Settings লোড করা (না পেলে Default ভ্যালু)
  const savedInterval = parseInt(localStorage.getItem('restInterval')) || 1200
  const savedSound = localStorage.getItem('soundEnabled') !== 'false'

  const [isResting, setIsResting] = useState(false)
  const [skipCount, setSkipCount] = useState(0)
  const [timeLeftForNextRest, setTimeLeftForNextRest] = useState(savedInterval)
  const [isIdle, setIsIdle] = useState(false)

  // Settings State
  const [intervalSetting, setIntervalSetting] = useState(savedInterval)
  const [isSoundEnabled, setIsSoundEnabled] = useState(savedSound)

  const handleTestRest = () => {
    setIsResting(true)
    window.api?.startRestMode()
  }

  const handleRestComplete = () => {
    setIsResting(false)
    setSkipCount(0)
    setTimeLeftForNextRest(intervalSetting) // সেটিংস অনুযায়ী টাইমার রিস্টার্ট
    window.api?.endRestMode()
  }

  const handleSkip = () => {
    if (skipCount < 1) {
      setSkipCount((prev) => prev + 1)
      setIsResting(false)
      setTimeLeftForNextRest(intervalSetting)
      window.api?.endRestMode()
    }
  }

  // Settings Save করার ফাংশন
  const saveSettings = (newInterval, newSoundState) => {
    localStorage.setItem('restInterval', newInterval)
    localStorage.setItem('soundEnabled', newSoundState)
    setIntervalSetting(newInterval)
    setIsSoundEnabled(newSoundState)
    setTimeLeftForNextRest(newInterval) // সাথে সাথে টাইমার আপডেট হবে
  }

  useEffect(() => {
    if (window.api) {
      window.api.onSystemIdle((idleState) => {
        setIsIdle(idleState)
      })
    }
  }, [])

  useEffect(() => {
    if (isResting || isIdle) return;
    if (timeLeftForNextRest <= 0) {
      const timeoutId = setTimeout(() => handleTestRest(), 0)
      return () => clearTimeout(timeoutId)
    }
    const timer = setInterval(() => {
      setTimeLeftForNextRest((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeftForNextRest, isResting, isIdle])

  const minutes = Math.floor(timeLeftForNextRest / 60)
  const seconds = timeLeftForNextRest % 60

  if (isResting) {
    return (
      <RestScreen
        onComplete={handleRestComplete}
        onSkip={handleSkip}
        skipCount={skipCount}
        isSoundEnabled={isSoundEnabled}
      />
    )
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="mb-2 text-4xl font-bold text-pink-500">
        ❤️ EyeCare Love
      </h1>
      <p className="mb-8 text-sm text-slate-400">Because every blink matters.</p>

      <div className="mb-8 flex flex-col items-center rounded-xl bg-slate-800/50 p-6 shadow-inner w-80">
        <p className="mb-2 text-slate-400">Next Break In</p>
        <h2 className={`text-5xl font-light mb-6 ${isIdle ? 'text-slate-500' : 'text-white'}`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </h2>

        {/* Settings Panel */}
        <div className="w-full border-t border-slate-700 pt-4">
          <p className="text-xs text-slate-400 mb-4 text-center uppercase tracking-wider">Settings</p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm">Rest Interval:</span>
            <select
              value={intervalSetting}
              onChange={(e) => saveSettings(parseInt(e.target.value), isSoundEnabled)}
              className="bg-slate-700 text-sm rounded px-2 py-1 outline-none focus:ring-1 focus:ring-pink-500"
            >
              <option value={60}>1 Minute (Test)</option>
              <option value={1200}>20 Minutes</option>
              <option value={1800}>30 Minutes</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Relaxing Sound:</span>
            <button
              onClick={() => saveSettings(intervalSetting, !isSoundEnabled)}
              className={`text-xs px-3 py-1 rounded-full transition-all ${isSoundEnabled ? 'bg-pink-600 text-white' : 'bg-slate-700 text-slate-400'}`}
            >
              {isSoundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* <button
        onClick={handleTestRest}
        className="cursor-pointer rounded-lg bg-pink-600 px-6 py-3 font-semibold text-white shadow-lg shadow-pink-500/30 transition-all hover:bg-pink-500"
      >
        Test Rest Mode Now
      </button> */}
    </div>
  )
}

export default App