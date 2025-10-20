export const CRISIS_RESOURCES = [
  { 
    label: "988 Suicide & Crisis Lifeline", 
    url: "tel:988",
    description: "Call or text 988"
  },
  { 
    label: "Crisis Text Line", 
    url: "sms:741741",
    description: "Text HOME to 741741"
  },
  { 
    label: "SAMHSA National Helpline", 
    url: "tel:1-800-662-4357",
    description: "1-800-662-HELP (4357)"
  },
];

export const SAFETY_TIPS = [
  {
    title: "Practice Grounding",
    description: "Use the 5-4-3-2-1 technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
  },
  {
    title: "Reach Out",
    description: "Connect with a friend, family member, or mental health professional. You don't have to go through this alone.",
  },
  {
    title: "Self-Care Basics",
    description: "Ensure you're getting enough sleep, eating regular meals, staying hydrated, and moving your body.",
  },
  {
    title: "Professional Support",
    description: "This AI is not a substitute for professional mental health care. Consider speaking with a therapist or counselor.",
  },
];

const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'want to die', 'end my life', 'self harm',
  'hurt myself', 'not worth living', 'no reason to live'
];

export const containsCrisisKeywords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword));
};
