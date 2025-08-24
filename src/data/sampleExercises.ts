import { Exercise } from '../types/Exercise';

export const sampleExercises: Omit<Exercise, 'id' | 'isActive' | 'timeRemaining' | 'isPaused'>[] = [
  {
    name: 'Push-ups',
    description: 'Start in a plank position with hands slightly wider than shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.',
    duration: 45
  },
  {
    name: 'Squats',
    description: 'Stand with feet shoulder-width apart. Lower your hips as if sitting back into a chair, keeping your chest up and knees behind your toes. Return to standing.',
    duration: 60
  },
  {
    name: 'Jumping Jacks',
    description: 'Start with feet together and arms at your sides. Jump while spreading your legs shoulder-width apart and raising your arms overhead. Jump back to starting position.',
    duration: 30
  },
  {
    name: 'Mountain Climbers',
    description: 'Start in a plank position. Alternate bringing each knee toward your chest in a running motion while keeping your core engaged and hips level.',
    duration: 45
  },
  {
    name: 'Burpees',
    description: 'From standing, squat down and place hands on floor. Jump feet back into plank, do a push-up, jump feet back to squat, then jump up with arms overhead.',
    duration: 40
  },
  {
    name: 'Plank Hold',
    description: 'Hold a plank position with your body in a straight line from head to heels. Keep your core tight and avoid letting your hips sag or rise too high.',
    duration: 60
  },
  {
    name: 'High Knees',
    description: 'Run in place while lifting your knees as high as possible toward your chest. Keep your core engaged and pump your arms for momentum.',
    duration: 30
  },
  {
    name: 'Lunges',
    description: 'Step forward with one leg and lower your hips until both knees are bent at 90 degrees. Keep your front knee over your ankle and push back to starting position.',
    duration: 50
  }
];