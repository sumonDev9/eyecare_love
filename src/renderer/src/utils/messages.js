// সাধারণ কেয়ারিং মেসেজ
const regularMessages = [
  "তোমার চোখ খুব মূল্যবান।\nএকটু বিশ্রাম নাও...",
  "আমি চাই তুমি ভালো থাকো।\nআজ অনেকক্ষণ কাজ করেছো।",
  "এবার নিজের জন্য ১ মিনিট।\nচোখ দুটোও সারাদিন কাজ করে।",
  "ওদেরও একটু বিশ্রাম দাও।\nএকটু দূরে তাকাও।",
  "চোখ আরাম পাবে।\nধীরে ধীরে শ্বাস নাও।\nধীরে ছাড়ো।",
  "নিজের যত্ন নেওয়াটাও খুব গুরুত্বপূর্ণ।\nআজও নিজের প্রতি একটু যত্নশীল হও।",
  "চোখ বন্ধ করো...\nসবকিছু একটু ধীরে চলুক।",
  "একটু থামো।\nবিশ্রাম নাও।\nতারপর আবার শুরু করো।"
]

// স্পেশাল সিক্রেট মেসেজ (Rare)
const secretMessages = [
  "❤️\nএই Reminder-টা\nতোমার খুব প্রিয় একজন\nনিজের হাতে বানিয়েছে।\nসে চায়\nতুমি নিজের চোখের যত্ন নাও।\nসবসময় ভালো থেকো।",
  "❤️\nকেউ একজন\nপ্রতিদিন চায়\nতুমি সুস্থ থাকো।\nতাই এই ছোট্ট Reminder।",
  "❤️\nযে মানুষটি তোমাকে খুব ভালোবাসে,\nসে চায় তুমি\nনিজের যত্ন নাও।",
  "❤️\nতোমার হাসিটা\nসবসময় সুন্দর থাকুক।\nতাই একটু Rest নাও।"
]

export const getRandomMessage = () => {
  // সিক্রেট মেসেজ আসার সম্ভাবনা ৫% (Rare) রাখা হলো
  const isSecret = Math.random() < 0.05
  
  if (isSecret) {
    const randomIndex = Math.floor(Math.random() * secretMessages.length)
    return { text: secretMessages[randomIndex], isSecret: true }
  } else {
    const randomIndex = Math.floor(Math.random() * regularMessages.length)
    return { text: regularMessages[randomIndex], isSecret: false }
  }
}