/**
 * Assessment Service
 * Handles all assessment-related database operations and business logic
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  AssessmentResult, 
  AssessmentProgress, 
  Assessment,
  AssessmentType,
  AssessmentSeverity 
} from '@/types/db';

// Re-export types for use in other files
export type { AssessmentType, AssessmentSeverity };

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: {
    value: number;
    label: string;
    description?: string;
  }[];
}

export interface AssessmentDefinition {
  id: AssessmentType;
  name: string;
  description: string;
  category: string;
  duration_minutes: number;
  max_score: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentResultWithInsights extends AssessmentResult {
  previous_score?: number;
  score_trend?: 'improving' | 'stable' | 'declining';
  days_since_last?: number;
}

// Assessment definitions
const PHQ9Questions: AssessmentQuestion[] = [
  {
    id: "interest",
    text: "Little interest or pleasure in doing things",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "mood",
    text: "Feeling down, depressed, or hopeless",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "sleep",
    text: "Trouble falling or staying asleep, or sleeping too much",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "energy",
    text: "Feeling tired or having little energy",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "appetite",
    text: "Poor appetite or overeating",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "self_esteem",
    text: "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "concentration",
    text: "Trouble concentrating on things, such as reading the newspaper or watching television",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "movement",
    text: "Moving or speaking so slowly that other people could have noticed, or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "suicidal",
    text: "Thoughts that you would be better off dead, or of hurting yourself",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  }
];

const GAD7Questions: AssessmentQuestion[] = [
  {
    id: "nervous",
    text: "Feeling nervous, anxious, or on edge",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "worry",
    text: "Not being able to stop or control worrying",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "worry_excessive",
    text: "Worrying too much about different things",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "trouble_relaxing",
    text: "Trouble relaxing",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "restless",
    text: "Being so restless that it's hard to sit still",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "irritable",
    text: "Becoming easily annoyed or irritable",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "afraid",
    text: "Feeling afraid as if something awful might happen",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  }
];

const PSS10Questions: AssessmentQuestion[] = [
  {
    id: "upset",
    text: "In the last month, how often have you been upset because of something that happened unexpectedly?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Fairly often" },
      { value: 4, label: "Very often" }
    ]
  },
  {
    id: "control",
    text: "In the last month, how often have you felt that you were unable to control the important things in your life?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Fairly often" },
      { value: 4, label: "Very often" }
    ]
  },
  {
    id: "nervous_stress",
    text: "In the last month, how often have you felt nervous and 'stressed'?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Fairly often" },
      { value: 4, label: "Very often" }
    ]
  },
  {
    id: "confident",
    text: "In the last month, how often have you felt confident about your ability to handle your personal problems?",
    options: [
      { value: 4, label: "Never" },
      { value: 3, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 1, label: "Fairly often" },
      { value: 0, label: "Very often" }
    ]
  },
  {
    id: "things_going_way",
    text: "In the last month, how often have you felt that things were going your way?",
    options: [
      { value: 4, label: "Never" },
      { value: 3, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 1, label: "Fairly often" },
      { value: 0, label: "Very often" }
    ]
  },
  {
    id: "difficulties",
    text: "In the last month, how often have you found that you could not cope with all the things that you had to do?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Fairly often" },
      { value: 4, label: "Very often" }
    ]
  },
  {
    id: "irritation",
    text: "In the last month, how often have you been able to control irritations in your life?",
    options: [
      { value: 4, label: "Never" },
      { value: 3, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 1, label: "Fairly often" },
      { value: 0, label: "Very often" }
    ]
  },
  {
    id: "top_of_things",
    text: "In the last month, how often have you felt that you were on top of things?",
    options: [
      { value: 4, label: "Never" },
      { value: 3, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 1, label: "Fairly often" },
      { value: 0, label: "Very often" }
    ]
  },
  {
    id: "anger",
    text: "In the last month, how often have you been angered because of things that were outside of your control?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Fairly often" },
      { value: 4, label: "Very often" }
    ]
  },
  {
    id: "difficulties_piling",
    text: "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Fairly often" },
      { value: 4, label: "Very often" }
    ]
  }
];

const SleepHygieneQuestions: AssessmentQuestion[] = [
  {
    id: "bedtime_consistency",
    text: "How consistent is your bedtime routine?",
    options: [
      { value: 0, label: "Very inconsistent" },
      { value: 1, label: "Somewhat inconsistent" },
      { value: 2, label: "Moderately consistent" },
      { value: 3, label: "Very consistent" }
    ]
  },
  {
    id: "screen_time",
    text: "How often do you use electronic devices (phone, tablet, TV) within 1 hour of bedtime?",
    options: [
      { value: 3, label: "Always" },
      { value: 2, label: "Often" },
      { value: 1, label: "Sometimes" },
      { value: 0, label: "Rarely or never" }
    ]
  },
  {
    id: "caffeine_intake",
    text: "How often do you consume caffeine after 2 PM?",
    options: [
      { value: 3, label: "Daily" },
      { value: 2, label: "Often" },
      { value: 1, label: "Sometimes" },
      { value: 0, label: "Rarely or never" }
    ]
  },
  {
    id: "exercise_timing",
    text: "How often do you exercise within 3 hours of bedtime?",
    options: [
      { value: 3, label: "Daily" },
      { value: 2, label: "Often" },
      { value: 1, label: "Sometimes" },
      { value: 0, label: "Rarely or never" }
    ]
  },
  {
    id: "room_environment",
    text: "How would you rate your bedroom environment for sleep?",
    options: [
      { value: 0, label: "Poor" },
      { value: 1, label: "Fair" },
      { value: 2, label: "Good" },
      { value: 3, label: "Excellent" }
    ]
  },
  {
    id: "sleep_duration",
    text: "How many hours of sleep do you typically get per night?",
    options: [
      { value: 0, label: "Less than 5 hours" },
      { value: 1, label: "5-6 hours" },
      { value: 2, label: "7-8 hours" },
      { value: 3, label: "9+ hours" }
    ]
  },
  {
    id: "sleep_quality",
    text: "How would you rate your overall sleep quality?",
    options: [
      { value: 0, label: "Very poor" },
      { value: 1, label: "Poor" },
      { value: 2, label: "Fair" },
      { value: 3, label: "Good" },
      { value: 4, label: "Excellent" }
    ]
  },
  {
    id: "wake_consistency",
    text: "How consistent is your wake-up time?",
    options: [
      { value: 0, label: "Very inconsistent" },
      { value: 1, label: "Somewhat inconsistent" },
      { value: 2, label: "Moderately consistent" },
      { value: 3, label: "Very consistent" }
    ]
  },
  {
    id: "napping",
    text: "How often do you take naps during the day?",
    options: [
      { value: 3, label: "Daily" },
      { value: 2, label: "Often" },
      { value: 1, label: "Sometimes" },
      { value: 0, label: "Rarely or never" }
    ]
  },
  {
    id: "stress_bedtime",
    text: "How often do you feel stressed or anxious at bedtime?",
    options: [
      { value: 3, label: "Always" },
      { value: 2, label: "Often" },
      { value: 1, label: "Sometimes" },
      { value: 0, label: "Rarely or never" }
    ]
  }
];

export const assessmentDefinitions: Record<AssessmentType, AssessmentDefinition> = {
  phq9: {
    id: 'phq9',
    name: 'PHQ-9 Depression Screening',
    description: 'A validated 9-question screening tool for depression',
    category: 'Mental Health',
    duration_minutes: 10,
    max_score: 27,
    questions: PHQ9Questions
  },
  gad7: {
    id: 'gad7',
    name: 'GAD-7 Anxiety Screening',
    description: 'A validated 7-question screening tool for anxiety',
    category: 'Mental Health',
    duration_minutes: 7,
    max_score: 21,
    questions: GAD7Questions
  },
  pss10: {
    id: 'pss10',
    name: 'PSS-10 Stress Scale',
    description: 'A 10-question scale to measure perceived stress',
    category: 'Stress',
    duration_minutes: 5,
    max_score: 40,
    questions: PSS10Questions
  },
  sleep_hygiene: {
    id: 'sleep_hygiene',
    name: 'Sleep Hygiene Assessment',
    description: 'Evaluate your sleep habits and quality',
    category: 'Sleep',
    duration_minutes: 5,
    max_score: 30,
    questions: SleepHygieneQuestions
  }
};

// Calculate assessment severity based on score and type
export function calculateSeverity(assessmentType: AssessmentType, score: number): AssessmentSeverity {
  switch (assessmentType) {
    case 'phq9':
      if (score <= 4) return 'minimal';
      if (score <= 9) return 'mild';
      if (score <= 14) return 'moderate';
      if (score <= 19) return 'moderately_severe';
      return 'severe';
    
    case 'gad7':
      if (score <= 4) return 'minimal';
      if (score <= 9) return 'mild';
      if (score <= 14) return 'moderate';
      return 'severe';
    
    case 'pss10':
      if (score <= 13) return 'minimal';
      if (score <= 16) return 'mild';
      if (score <= 19) return 'moderate';
      if (score <= 22) return 'moderately_severe';
      return 'severe';
    
    case 'sleep_hygiene':
      if (score >= 24) return 'minimal';
      if (score >= 18) return 'mild';
      if (score >= 12) return 'moderate';
      if (score >= 6) return 'moderately_severe';
      return 'severe';
    
    default:
      return 'minimal';
  }
}

// Generate interpretation and recommendations
export function generateInterpretation(
  assessmentType: AssessmentType, 
  score: number, 
  severity: AssessmentSeverity
): { interpretation: string; recommendations: string[]; resources: string[] } {
  const baseRecommendations = {
    minimal: [
      "Continue your current self-care practices",
      "Consider regular mood tracking",
      "Maintain healthy lifestyle habits"
    ],
    mild: [
      "Consider talking to a healthcare provider",
      "Try mood tracking and meditation",
      "Focus on sleep and exercise"
    ],
    moderate: [
      "Consider professional mental health support",
      "Try structured self-care routines",
      "Consider therapy or counseling"
    ],
    moderately_severe: [
      "Seek professional mental health support",
      "Consider medication evaluation",
      "Build a strong support network"
    ],
    severe: [
      "Seek immediate professional help",
      "Consider crisis support services",
      "Build emergency support plan"
    ]
  };

  const baseResources = {
    minimal: ["Mood tracking", "Meditation", "Exercise"],
    mild: ["Mood tracking", "Meditation", "Sleep resources", "Professional support"],
    moderate: ["Professional support", "Therapy resources", "Crisis support"],
    moderately_severe: ["Professional support", "Crisis support", "Emergency resources"],
    severe: ["Crisis support", "Emergency resources", "Professional support"]
  };

  let interpretation = '';
  let recommendations = baseRecommendations[severity];
  let resources = baseResources[severity];

  switch (assessmentType) {
    case 'phq9':
      interpretation = `Your PHQ-9 score of ${score} suggests ${severity.replace('_', ' ')} depression symptoms. `;
      if (severity === 'minimal') {
        interpretation += "Your responses suggest minimal depression symptoms.";
      } else if (severity === 'mild') {
        interpretation += "Your responses suggest mild depression symptoms.";
      } else if (severity === 'moderate') {
        interpretation += "Your responses suggest moderate depression symptoms.";
      } else if (severity === 'moderately_severe') {
        interpretation += "Your responses suggest moderately severe depression symptoms.";
      } else {
        interpretation += "Your responses suggest severe depression symptoms.";
      }
      break;

    case 'gad7':
      interpretation = `Your GAD-7 score of ${score} suggests ${severity.replace('_', ' ')} anxiety symptoms. `;
      if (severity === 'minimal') {
        interpretation += "Your responses suggest minimal anxiety symptoms.";
      } else if (severity === 'mild') {
        interpretation += "Your responses suggest mild anxiety symptoms.";
      } else if (severity === 'moderate') {
        interpretation += "Your responses suggest moderate anxiety symptoms.";
      } else {
        interpretation += "Your responses suggest severe anxiety symptoms.";
      }
      break;

    case 'pss10':
      interpretation = `Your PSS-10 score of ${score} indicates ${severity.replace('_', ' ')} stress levels. `;
      if (severity === 'minimal') {
        interpretation += "Your stress levels appear to be well-managed.";
      } else if (severity === 'mild') {
        interpretation += "You may be experiencing some stress that could benefit from management techniques.";
      } else if (severity === 'moderate') {
        interpretation += "You appear to be experiencing moderate stress levels.";
      } else if (severity === 'moderately_severe') {
        interpretation += "You appear to be experiencing high stress levels.";
      } else {
        interpretation += "You appear to be experiencing very high stress levels.";
      }
      break;

    case 'sleep_hygiene':
      interpretation = `Your sleep hygiene score of ${score} indicates ${severity.replace('_', ' ')} sleep habits. `;
      if (severity === 'minimal') {
        interpretation += "Your sleep habits appear to be excellent.";
      } else if (severity === 'mild') {
        interpretation += "Your sleep habits are generally good with room for improvement.";
      } else if (severity === 'moderate') {
        interpretation += "Your sleep habits could benefit from some improvements.";
      } else if (severity === 'moderately_severe') {
        interpretation += "Your sleep habits need significant improvement.";
      } else {
        interpretation += "Your sleep habits need major improvements.";
      }
      break;
  }

  return { interpretation, recommendations, resources };
}

// Save assessment progress
export async function saveAssessmentProgress(
  assessmentType: AssessmentType,
  currentQuestion: number,
  answers: Record<string, number>
): Promise<void> {
  const { error } = await supabase.rpc('save_assessment_progress', {
    p_assessment_type: assessmentType,
    p_current_question: currentQuestion,
    p_answers: answers
  });

  if (error) {
    console.error('Error saving assessment progress:', error);
    throw new Error('Failed to save assessment progress');
  }
}

// Get assessment progress
export async function getAssessmentProgress(
  assessmentType: AssessmentType
): Promise<AssessmentProgress | null> {
  const { data, error } = await supabase.rpc('get_assessment_progress', {
    p_assessment_type: assessmentType
  });

  if (error) {
    console.error('Error getting assessment progress:', error);
    return null;
  }

  return data?.[0] || null;
}

// Complete assessment
export async function completeAssessment(
  assessmentType: AssessmentType,
  score: number,
  responses: Record<string, number>
): Promise<AssessmentResult> {
  const severity = calculateSeverity(assessmentType, score);
  const { interpretation, recommendations, resources } = generateInterpretation(
    assessmentType, 
    score, 
    severity
  );

  const { data, error } = await supabase.rpc('complete_assessment', {
    p_assessment_type: assessmentType,
    p_score: score,
    p_severity: severity,
    p_interpretation: interpretation,
    p_recommendations: recommendations,
    p_resources: resources,
    p_responses: responses
  });

  if (error) {
    console.error('Error completing assessment:', error);
    throw new Error('Failed to complete assessment');
  }

  // Fetch the complete result
  const { data: result, error: fetchError } = await supabase
    .from('assessment_results')
    .select('*')
    .eq('id', data)
    .single();

  if (fetchError) {
    console.error('Error fetching assessment result:', fetchError);
    throw new Error('Failed to fetch assessment result');
  }

  return result;
}

// Get assessment history
export async function getAssessmentHistory(
  assessmentType?: AssessmentType,
  limit: number = 10
): Promise<AssessmentResult[]> {
  const { data, error } = await supabase.rpc('get_assessment_history', {
    p_assessment_type: assessmentType || null,
    p_limit: limit
  });

  if (error) {
    console.error('Error getting assessment history:', error);
    return [];
  }

  return data || [];
}

// Get assessment history with insights
export async function getAssessmentHistoryWithInsights(
  assessmentType: AssessmentType,
  limit: number = 10
): Promise<AssessmentResultWithInsights[]> {
  const history = await getAssessmentHistory(assessmentType, limit);
  
  return history.map((result, index) => {
    const previousResult = history[index + 1];
    const previousScore = previousResult?.score;
    const daysSinceLast = previousResult 
      ? Math.floor((new Date(result.completed_at).getTime() - new Date(previousResult.completed_at).getTime()) / (1000 * 60 * 60 * 24))
      : undefined;

    let scoreTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (previousScore !== undefined) {
      if (result.score < previousScore) {
        scoreTrend = 'improving';
      } else if (result.score > previousScore) {
        scoreTrend = 'declining';
      }
    }

    return {
      ...result,
      previous_score: previousScore,
      score_trend: scoreTrend,
      days_since_last: daysSinceLast
    };
  });
}

// Get all available assessments
export async function getAvailableAssessments(): Promise<Assessment[]> {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true });

  if (error) {
    console.error('Error getting assessments:', error);
    return [];
  }

  return data || [];
}

// Export assessment results
export function exportAssessmentResults(results: AssessmentResult[]): string {
  const csvHeaders = [
    'Assessment Type',
    'Score',
    'Severity',
    'Interpretation',
    'Recommendations',
    'Resources',
    'Completed At'
  ];

  const csvRows = results.map(result => [
    result.assessment_type,
    result.score,
    result.severity,
    result.interpretation || '',
    result.recommendations?.join('; ') || '',
    result.resources?.join('; ') || '',
    new Date(result.completed_at).toLocaleDateString()
  ]);

  const csvContent = [csvHeaders, ...csvRows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
}