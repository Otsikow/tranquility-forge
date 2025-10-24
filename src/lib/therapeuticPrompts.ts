/**
 * Therapeutic prompts and system instructions for enhanced AI chat
 * Implements CBT, DBT, and other evidence-based therapeutic techniques
 */

export const THERAPEUTIC_SYSTEM_PROMPT = `You are Peace, a compassionate AI mental health companion trained in evidence-based therapeutic approaches including Cognitive Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT), and mindfulness-based interventions.

Your role is to:
- Provide empathetic, non-judgmental support
- Help users identify and challenge unhelpful thought patterns (CBT)
- Teach emotional regulation and distress tolerance skills (DBT)
- Guide users through mindfulness and grounding exercises
- Encourage healthy coping strategies and self-care
- Normalize mental health struggles while promoting growth

Important guidelines:
- You are NOT a replacement for professional therapy or medical advice
- Always validate emotions before offering alternative perspectives
- Use the Socratic method to help users discover insights
- Be warm, supportive, and person-centered
- If a user expresses crisis or self-harm thoughts, immediately provide crisis resources
- Respect boundaries and cultural differences
- Focus on strengths and resilience

Therapeutic techniques to employ:
1. CBT: Help identify cognitive distortions (all-or-nothing thinking, catastrophizing, etc.)
2. DBT: Teach DEAR MAN, GIVE, FAST skills for interpersonal effectiveness
3. Mindfulness: Guide present-moment awareness exercises
4. Behavioral Activation: Encourage engagement in valued activities
5. Cognitive Restructuring: Help develop balanced, realistic thoughts

Always maintain a collaborative, empowering tone. Ask open-ended questions to deepen understanding.`;

export const THERAPEUTIC_TECHNIQUES = {
  cbt: {
    name: "Cognitive Behavioral Therapy",
    description: "Identify and challenge unhelpful thoughts",
    prompts: [
      "What thoughts went through your mind when that happened?",
      "What evidence supports this thought? What evidence contradicts it?",
      "If a friend told you this, what would you say to them?",
      "What's a more balanced way to think about this situation?",
      "How would you rate the likelihood of your feared outcome (0-100%)?",
    ],
    distortions: [
      "All-or-nothing thinking",
      "Overgeneralization",
      "Mental filtering",
      "Discounting the positive",
      "Jumping to conclusions",
      "Magnification/Minimization",
      "Emotional reasoning",
      "Should statements",
      "Labeling",
      "Personalization"
    ]
  },
  dbt: {
    name: "Dialectical Behavior Therapy",
    description: "Build emotional regulation and interpersonal skills",
    skills: {
      mindfulness: [
        "Observe: Notice your thoughts without judgment",
        "Describe: Put words to your experience",
        "Participate: Engage fully in the moment",
        "Non-judgmental: Let go of evaluating as good/bad",
        "One-mindfully: Do one thing at a time",
        "Effectively: Focus on what works"
      ],
      distressTolerance: [
        "TIPP: Temperature, Intense exercise, Paced breathing, Paired muscle relaxation",
        "ACCEPTS: Activities, Contributing, Comparisons, Emotions, Push away, Thoughts, Sensations",
        "Self-Soothe: Engage the five senses",
        "IMPROVE: Imagery, Meaning, Prayer, Relaxation, One thing, Vacation, Encouragement"
      ],
      emotionRegulation: [
        "ABC PLEASE: Accumulate positives, Build mastery, Cope ahead, Physical health, Balance eating, Avoid substances, Sleep, Exercise",
        "Opposite Action: Act opposite to the emotion's urge",
        "Check the Facts: Is the emotion justified?",
        "Problem Solving: Address the situation directly"
      ],
      interpersonalEffectiveness: [
        "DEAR MAN: Describe, Express, Assert, Reinforce, Mindful, Appear confident, Negotiate",
        "GIVE: Gentle, Interested, Validate, Easy manner",
        "FAST: Fair, Apologies (no unnecessary), Stick to values, Truthful"
      ]
    }
  },
  mindfulness: {
    name: "Mindfulness",
    description: "Cultivate present-moment awareness",
    exercises: [
      "5-4-3-2-1 Grounding: Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste",
      "Body Scan: Notice sensations from head to toe",
      "Mindful Breathing: Focus on the breath for 2 minutes",
      "STOP: Stop, Take a breath, Observe, Proceed",
      "Leaves on a Stream: Visualize thoughts floating away on leaves"
    ]
  },
  behavioralActivation: {
    name: "Behavioral Activation",
    description: "Increase engagement in valued activities",
    prompts: [
      "What activities used to bring you joy?",
      "What small step could you take today?",
      "What are your values? How can your actions align with them?",
      "What's one activity you could do in the next 24 hours?",
      "How do you typically feel before vs. after the activity?"
    ]
  },
  validation: {
    name: "Validation Statements",
    levels: [
      "Presence: I'm here with you in this",
      "Accurate Reflection: It sounds like you're feeling...",
      "Mind-reading: I can understand why you'd feel that way",
      "Historical: Given your past experiences, your reaction makes sense",
      "Normalizing: Anyone in your situation would feel this way",
      "Radical Genuineness: Your feelings matter and are valid"
    ]
  },
  socraticQuestions: {
    name: "Socratic Questioning",
    categories: [
      "Clarification: Can you tell me more about...?",
      "Assumptions: What are you assuming here?",
      "Evidence: What makes you think that?",
      "Perspective: How might someone else view this?",
      "Implications: If that's true, what follows?",
      "Questions about the question: Why is this important to you?"
    ]
  }
};

export const CRISIS_RESPONSES = {
  suicidal: `I'm really concerned about what you're sharing. Your life matters, and I want you to get the support you need right now.

Please reach out to one of these resources immediately:

🆘 **Crisis Text Line**: Text HOME to 741741
📞 **National Suicide Prevention Lifeline**: 988 or 1-800-273-8255
🌍 **International**: findahelpline.com

If you're in immediate danger, please call 911 or go to your nearest emergency room.

You don't have to face this alone. Would you be willing to reach out to one of these resources?`,
  
  selfHarm: `I hear that you're struggling. Self-harm can be a way to cope with overwhelming feelings, and I'm here to support you in finding healthier ways to manage.

If you're in crisis:
📞 **Crisis Text Line**: Text HOME to 741741
📞 **National Suicide Prevention Lifeline**: 988

Some alternatives to consider:
- Hold ice cubes
- Snap a rubber band on your wrist
- Draw on yourself with red marker
- Intense exercise
- Call a friend or crisis line

Would you like to talk about what's making you want to hurt yourself?`,
  
  abuse: `I'm so sorry you're experiencing this. You deserve to be safe and treated with respect.

If you're in immediate danger, please call 911.

Resources:
📞 **National Domestic Violence Hotline**: 1-800-799-7233
📞 **RAINN (Sexual Assault)**: 1-800-656-4673

These services are:
- Free and confidential
- Available 24/7
- Supportive and non-judgmental

Your safety is the priority. Would you like to talk about safety planning?`
};

export function getTherapeuticResponse(context: string, userInput: string): string {
  // This is a simplified version - in production, this would use
  // more sophisticated NLP and context analysis
  
  const input = userInput.toLowerCase();
  
  // Detect cognitive distortions
  if (input.includes("always") || input.includes("never")) {
    return "I notice you're using absolute language like 'always' or 'never'. This might be all-or-nothing thinking. Can you think of any exceptions to this?";
  }
  
  if (input.includes("should") || input.includes("must")) {
    return "I hear some 'should' statements. These can create pressure. What happens if we reframe this as a preference rather than a rule?";
  }
  
  // Offer validation first
  if (input.includes("anxious") || input.includes("worried")) {
    return "It's completely understandable to feel anxious. Anxiety is our body's way of trying to protect us. What specifically are you worried about?";
  }
  
  return "";
}

export function suggestExercise(emotion: string): string {
  const exercises: Record<string, string> = {
    anxiety: "Would you like to try a quick grounding exercise? We could do 5-4-3-2-1 together, or some box breathing.",
    sadness: "When we're feeling low, sometimes gentle action helps. Would you like to explore some small activities that might help?",
    anger: "Anger often signals that something important to you is at stake. Would you like to explore what's underneath the anger?",
    overwhelmed: "It sounds like there's a lot going on. Would it help to break things down into smaller pieces together?"
  };
  
  return exercises[emotion.toLowerCase()] || "Would you like to try a mindfulness exercise to help with what you're feeling?";
}
