# Assessment Feature Documentation

## Overview
The Assessment feature provides validated mental health screening tools to help users understand their mental wellbeing. This feature includes:

- **PHQ-9**: Depression screening (9 questions, 0-27 points)
- **GAD-7**: Anxiety screening (7 questions, 0-21 points)
- **PSS-10**: Perceived Stress Scale (10 questions, 0-40 points)
- **Sleep Hygiene Assessment**: Sleep habits evaluation (10 questions, 0-40 points)

## Features

### ✅ Completed Features

1. **Four Complete Assessments**
   - PHQ-9 (Depression)
   - GAD-7 (Anxiety)
   - PSS-10 (Stress)
   - Sleep Hygiene

2. **Database Persistence**
   - All assessment results are stored in PostgreSQL via Supabase
   - Full history tracking
   - User-specific data with RLS policies

3. **Results Visualization**
   - Immediate score display after completion
   - Severity level indicators (minimal, mild, moderate, moderately severe, severe)
   - Personalized recommendations
   - Suggested resources

4. **History Tracking**
   - View all past assessment results
   - Line chart visualization of score trends
   - Trend indicators (improving, stable, worsening)
   - Date-based organization

5. **Detailed Results View**
   - Complete assessment breakdown
   - Interpretation of scores
   - Actionable recommendations
   - Resource suggestions

6. **User Experience**
   - Progress tracking during assessment
   - Question navigation (next/previous)
   - Category filtering
   - Loading states
   - Error handling
   - Toast notifications

## Database Schema

### assessment_results Table

```sql
CREATE TABLE assessment_results (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  assessment_type assessment_type NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  severity_level severity_level NOT NULL,
  interpretation TEXT NOT NULL,
  recommendations TEXT[] DEFAULT '{}',
  resources TEXT[] DEFAULT '{}',
  answers JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
);
```

### Enums

- `assessment_type`: phq9, gad7, pss10, sleep_hygiene
- `severity_level`: minimal, mild, moderate, moderately_severe, severe

### Functions

1. **get_assessment_history(p_user_id, p_assessment_type, p_limit)**
   - Returns paginated assessment history
   - Optional filtering by assessment type

2. **get_latest_assessments(p_user_id)**
   - Returns the latest result for each assessment type
   - Used for dashboard display

3. **get_assessment_stats(p_user_id, p_assessment_type)**
   - Returns statistics including count, averages, min/max scores
   - Calculates trend (improving/stable/worsening)

## Score Interpretation

### PHQ-9 (Depression)
- 0-4: Minimal depression
- 5-9: Mild depression
- 10-14: Moderate depression
- 15-19: Moderately severe depression
- 20-27: Severe depression

### GAD-7 (Anxiety)
- 0-4: Minimal anxiety
- 5-9: Mild anxiety
- 10-14: Moderate anxiety
- 15-21: Severe anxiety

### PSS-10 (Stress)
- 0-13: Low stress
- 14-26: Moderate stress
- 27-40: High stress

### Sleep Hygiene
- 32-40: Excellent sleep hygiene
- 24-31: Good sleep hygiene
- 16-23: Needs improvement
- 0-15: Major attention needed

## Components

### 1. Assessments Page (`/src/pages/Assessments.tsx`)
Main page with:
- Assessment cards grid
- Category filtering
- History tab with visualization
- Crisis resources section

### 2. SelfAssessment Component (`/src/components/SelfAssessment.tsx`)
Reusable assessment flow:
- Question presentation
- Answer collection
- Progress tracking
- Results display
- Database persistence

### 3. useAssessments Hook (`/src/hooks/useAssessments.ts`)
Database operations:
- `saveAssessmentResult()`: Save completed assessment
- `getAssessmentHistory()`: Fetch assessment history
- `getLatestAssessments()`: Get latest results
- `getAssessmentStats()`: Get statistics
- `getAssessmentById()`: Fetch specific result
- `deleteAssessmentResult()`: Delete result

## Usage

### Taking an Assessment

```typescript
import SelfAssessment from '@/components/SelfAssessment';

<SelfAssessment
  assessmentType="phq9"
  onComplete={(result) => console.log(result)}
  onClose={() => console.log('Closed')}
/>
```

### Accessing Assessment Data

```typescript
import { useAssessments } from '@/hooks/useAssessments';

function MyComponent() {
  const { getLatestAssessments, loading } = useAssessments();

  useEffect(() => {
    async function loadData() {
      const latest = await getLatestAssessments();
      console.log(latest.phq9); // Latest PHQ-9 result
    }
    loadData();
  }, []);
}
```

## Security

1. **Row Level Security (RLS)**
   - Users can only access their own assessment results
   - All queries automatically filtered by user_id

2. **Authentication Required**
   - All assessment operations require authenticated user
   - Unauthenticated requests are rejected

3. **Data Validation**
   - Enum types ensure data integrity
   - Required fields enforced at database level

## Testing

### Manual Testing Checklist

- [ ] Take PHQ-9 assessment
- [ ] Take GAD-7 assessment
- [ ] Take PSS-10 assessment
- [ ] Take Sleep Hygiene assessment
- [ ] Verify results are saved to database
- [ ] View assessment history
- [ ] Check score visualization chart
- [ ] View detailed results
- [ ] Retake an assessment
- [ ] Verify trend indicators work
- [ ] Test category filtering
- [ ] Test tab navigation
- [ ] Verify crisis resources displayed

### Database Testing

```sql
-- Check assessment results
SELECT * FROM assessment_results WHERE user_id = 'your-user-id';

-- Get assessment history
SELECT * FROM get_assessment_history('your-user-id', 'phq9', 10);

-- Get latest assessments
SELECT * FROM get_latest_assessments('your-user-id');

-- Get statistics
SELECT * FROM get_assessment_stats('your-user-id', 'phq9');
```

## Future Enhancements

1. **Export Functionality**
   - PDF export of results
   - CSV export for data analysis

2. **Sharing**
   - Share results with healthcare providers
   - Generate shareable reports

3. **Reminders**
   - Scheduled assessment reminders
   - Recommendation-based follow-ups

4. **More Assessments**
   - PTSD screening (PCL-5)
   - Burnout assessment
   - Wellbeing scales

5. **Analytics**
   - Correlation analysis between assessments
   - Mood correlation with assessment scores
   - Insights dashboard

## Troubleshooting

### Assessment Not Saving

1. Check user authentication status
2. Verify Supabase connection
3. Check browser console for errors
4. Verify RLS policies are active

### History Not Loading

1. Ensure migration has been run
2. Check database functions exist
3. Verify user has taken assessments
4. Check network tab for failed requests

### Chart Not Displaying

1. Verify recharts is installed
2. Check for sufficient data points (need at least 2)
3. Verify date formatting is correct
4. Check browser console for errors

## Support Resources

- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- Emergency Services: 911

## License

This feature is part of the Peace mental health application and follows the same license terms.
