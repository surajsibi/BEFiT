import type { BodyPart, Exercise } from "./exercise-data";

export type PlanExercise = {
  id: string;
  focus: string;
  sets: number;
  reps: string;
  rest: string;
  rating: 4 | 5;
  why: string;
};

export type WorkoutPlan = {
  summary: string;
  exercises: PlanExercise[];
};

// These are sample sessions, not individual prescriptions. Ratings describe how well
// each movement fits this particular plan; they are not user or clinical ratings.
export const workoutPlans: Record<BodyPart, WorkoutPlan> = {
  Chest: {
    summary: "A balanced session with an incline press for the upper pecs, a flat press for the middle, a decline press for the lower region, then two controlled fly variations.",
    exercises: [
      { id: "Incline_Dumbbell_Press", focus: "Upper chest", sets: 3, reps: "8–10", rest: "90–120 sec", rating: 5, why: "Incline pressing shifts more work toward the upper pec fibers." },
      { id: "Barbell_Bench_Press_-_Medium_Grip", focus: "Middle chest", sets: 3, reps: "6–10", rest: "90–120 sec", rating: 5, why: "The main flat press gives the session a strong horizontal push." },
      { id: "Decline_Dumbbell_Bench_Press", focus: "Lower chest", sets: 2, reps: "8–12", rest: "75–90 sec", rating: 4, why: "A decline angle adds a lower-pec emphasis without another heavy barbell lift." },
      { id: "Low_Cable_Crossover", focus: "Upper chest · fly", sets: 2, reps: "12–15", rest: "60–75 sec", rating: 4, why: "The low-to-high path adds a controlled squeeze after pressing." },
      { id: "Cable_Crossover", focus: "Middle / lower chest · fly", sets: 2, reps: "12–15", rest: "60–75 sec", rating: 4, why: "Finish with a comfortable range and steady tension across the pecs." },
    ],
  },
  Back: {
    summary: "Vertical pulling, two row angles, a lat isolation move and a light back extension cover the main back functions.",
    exercises: [
      { id: "Wide-Grip_Lat_Pulldown", focus: "Lats · vertical pull", sets: 3, reps: "8–12", rest: "90 sec", rating: 5, why: "A stable vertical pull trains the lats through a useful range." },
      { id: "Seated_Cable_Rows", focus: "Middle back", sets: 3, reps: "8–12", rest: "90 sec", rating: 5, why: "A horizontal row balances the pulldown and trains the mid-back." },
      { id: "One-Arm_Dumbbell_Row", focus: "Lats · one side at a time", sets: 2, reps: "10–12 / side", rest: "75 sec", rating: 4, why: "The single-arm setup lets you focus on each side's path." },
      { id: "Straight-Arm_Pulldown", focus: "Lats · isolation", sets: 2, reps: "12–15", rest: "60 sec", rating: 4, why: "Adds lat work without another elbow-heavy row." },
      { id: "Hyperextensions_Back_Extensions", focus: "Lower back", sets: 2, reps: "10–15", rest: "60 sec", rating: 4, why: "Controlled extension rounds out the session's lower-back work." },
    ],
  },
  Legs: {
    summary: "A squat, hinge, single-leg movement and two machine finishes cover quads, hamstrings, glutes and calves.",
    exercises: [
      { id: "Barbell_Squat", focus: "Quads · glutes", sets: 3, reps: "6–10", rest: "120 sec", rating: 5, why: "The main knee-dominant lift anchors the session." },
      { id: "Romanian_Deadlift", focus: "Hamstrings · glutes", sets: 3, reps: "8–10", rest: "90–120 sec", rating: 5, why: "A hip hinge adds posterior-chain work that squats alone do not cover." },
      { id: "Dumbbell_Lunges", focus: "Quads · glutes · balance", sets: 2, reps: "8–10 / leg", rest: "75–90 sec", rating: 4, why: "Single-leg work trains each side through a controlled stride." },
      { id: "Seated_Leg_Curl", focus: "Hamstrings", sets: 2, reps: "10–15", rest: "60–75 sec", rating: 4, why: "Knee flexion complements the Romanian deadlift's hip hinge." },
      { id: "Standing_Calf_Raises", focus: "Calves", sets: 2, reps: "12–15", rest: "60 sec", rating: 4, why: "Finishes the lower-leg portion of the session." },
    ],
  },
  Shoulders: {
    summary: "One overhead press followed by side and rear-delt work gives the shoulders broad coverage without stacking heavy presses.",
    exercises: [
      { id: "Dumbbell_Shoulder_Press", focus: "Overhead press · front delts", sets: 3, reps: "8–10", rest: "90 sec", rating: 5, why: "The main overhead movement trains pressing strength and front delts." },
      { id: "Side_Lateral_Raise", focus: "Side delts", sets: 3, reps: "12–15", rest: "60 sec", rating: 5, why: "Direct side-delt work complements the press." },
      { id: "Cable_Rear_Delt_Fly", focus: "Rear delts", sets: 3, reps: "12–15", rest: "60 sec", rating: 5, why: "Rear-delt flyes cover the part of the shoulder a press misses." },
      { id: "Face_Pull", focus: "Rear delts · upper back", sets: 2, reps: "12–15", rest: "60 sec", rating: 4, why: "A light pull adds upper-back and rear-shoulder work." },
    ],
  },
  Arms: {
    summary: "Pair biceps and triceps work, then include a neutral-grip curl and forearm finish.",
    exercises: [
      { id: "Barbell_Curl", focus: "Biceps", sets: 3, reps: "8–12", rest: "75 sec", rating: 5, why: "A simple two-arm curl anchors the elbow-flexion work." },
      { id: "Triceps_Pushdown_-_Rope_Attachment", focus: "Triceps", sets: 3, reps: "8–12", rest: "75 sec", rating: 5, why: "A stable cable movement anchors the elbow-extension work." },
      { id: "Incline_Dumbbell_Curl", focus: "Biceps · long-length curl", sets: 2, reps: "10–12", rest: "60 sec", rating: 4, why: "A different arm position adds variety to the biceps work." },
      { id: "Cable_Rope_Overhead_Triceps_Extension", focus: "Triceps · overhead", sets: 2, reps: "10–15", rest: "60 sec", rating: 4, why: "The overhead angle complements the pushdown." },
      { id: "Hammer_Curls", focus: "Brachialis · forearms", sets: 2, reps: "10–12", rest: "60 sec", rating: 4, why: "A neutral grip brings the brachialis and forearms into the finish." },
    ],
  },
  Core: {
    summary: "Practice bracing, flexion, hip flexion and rotation in a short, controlled sequence.",
    exercises: [
      { id: "Dead_Bug", focus: "Bracing", sets: 2, reps: "8–10 / side", rest: "45 sec", rating: 5, why: "Starts with controlled trunk stability and breathing." },
      { id: "Plank", focus: "Anti-extension", sets: 2, reps: "20–40 sec", rest: "45 sec", rating: 5, why: "Builds a steady brace without moving the spine." },
      { id: "Crunches", focus: "Abs · flexion", sets: 2, reps: "12–15", rest: "45 sec", rating: 4, why: "Adds direct abdominal flexion in a simple setup." },
      { id: "Reverse_Crunch", focus: "Lower abs / hip flexion", sets: 2, reps: "10–15", rest: "45 sec", rating: 4, why: "Adds a controlled pelvis-up movement." },
      { id: "Russian_Twist", focus: "Rotation", sets: 2, reps: "8–12 / side", rest: "45 sec", rating: 4, why: "Finishes with a slow rotational pattern." },
    ],
  },
};

/** A transparent editorial fit score for the selected body part, never a user review. */
export function trainingFitFor(exercise: Exercise, bodyPart: BodyPart): 1 | 2 | 3 | 4 | 5 {
  const planPick = workoutPlans[bodyPart].exercises.find((item) => item.id === exercise.id);
  if (planPick) return planPick.rating;

  const isPrimary = exercise.primaryBodyParts.includes(bodyPart);
  if (!exercise.instructions.length || exercise.category === "stretching") return isPrimary ? 2 : 1;
  if (!isPrimary) return 2;
  if (exercise.category === "strength" && exercise.mechanic === "compound" && exercise.level !== "expert") return 4;
  return 3;
}
