import sourceCatalog from "./data/exercise-catalog.json";

export type BodyPart = "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core";

type SourceExercise = {
  id: string;
  name: string;
  force: string | null;
  level: "beginner" | "intermediate" | "expert";
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
};

export type Exercise = SourceExercise & {
  bodyParts: BodyPart[];
  primaryBodyParts: BodyPart[];
  focus: Partial<Record<BodyPart, string[]>>;
  imageUrls: [string, string];
  searchText: string;
};

type BodyPartInfo = {
  short: string;
  description: string;
  focusOrder: string[];
  accent: "orange" | "blue" | "lime" | "pink" | "violet" | "yellow";
  note?: string;
};

export const bodyPartOrder: BodyPart[] = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

export const bodyPartInfo: Record<BodyPart, BodyPartInfo> = {
  Chest: {
    short: "Pecs",
    description: "Explore presses, fly variations, bodyweight work and stretches across flat, incline and decline angles.",
    focusOrder: ["Upper chest", "Middle chest", "Lower chest", "Fly & squeeze", "Mobility & stretch"],
    accent: "orange",
    note: "There is no separate inner-chest muscle. Fly and squeeze movements train the pecs through horizontal adduction, while the visible gap near the sternum is strongly affected by your anatomy.",
  },
  Back: {
    short: "Pull",
    description: "Choose from vertical pulls, rows, trap work, spinal extension and mobility for complete back coverage.",
    focusOrder: ["Lats", "Middle back", "Lower back", "Traps", "Mobility & stretch"],
    accent: "blue",
  },
  Legs: {
    short: "Lower body",
    description: "Filter by quads, hamstrings, glutes, calves and the smaller hip muscles instead of treating the legs as one area.",
    focusOrder: ["Quadriceps", "Hamstrings", "Glutes", "Calves", "Adductors", "Abductors", "Mobility & stretch"],
    accent: "lime",
  },
  Shoulders: {
    short: "Delts",
    description: "Browse front, side and rear-delt movements alongside overhead presses, cuff work and shoulder mobility.",
    focusOrder: ["Front delts", "Side delts", "Rear delts", "Overhead press", "Rotator cuff", "Full shoulder", "Mobility & stretch"],
    accent: "pink",
  },
  Arms: {
    short: "Curl & extend",
    description: "Cover biceps, triceps, brachialis and forearms with multiple grips, angles and equipment choices.",
    focusOrder: ["Biceps", "Brachialis", "Triceps", "Forearms & grip", "Mobility & stretch"],
    accent: "violet",
  },
  Core: {
    short: "Trunk",
    description: "Find flexion, rotation, bracing, anti-extension and lower-back movements for a more complete trunk library.",
    focusOrder: ["Abs & flexion", "Lower abs / hip flexion", "Obliques & rotation", "Anti-extension", "Lower back", "Mobility & stretch"],
    accent: "yellow",
  },
};

const DATASET_COMMIT = "b0eed061e1c832b3ed815fbaa4b45b3cdc14df49";
const IMAGE_BASE = `https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@${DATASET_COMMIT}/exercises/`;

const bodyPartMuscles: Record<BodyPart, string[]> = {
  Chest: ["chest"],
  Back: ["lats", "middle back", "lower back", "traps"],
  Legs: ["quadriceps", "hamstrings", "glutes", "calves", "adductors", "abductors"],
  Shoulders: ["shoulders"],
  Arms: ["biceps", "triceps", "forearms"],
  Core: ["abdominals", "lower back"],
};

const hasAny = (values: string[], targets: string[]) => targets.some((target) => values.includes(target));

const unique = <T,>(values: T[]) => [...new Set(values)];

const encodeImagePath = (path: string) => path.split("/").map(encodeURIComponent).join("/");

const exerciseText = (exercise: SourceExercise) => `${exercise.name} ${exercise.instructions.join(" ")}`.toLowerCase();

function focusFor(bodyPart: BodyPart, exercise: SourceExercise) {
  const muscles = unique([...exercise.primaryMuscles, ...exercise.secondaryMuscles]);
  const text = exerciseText(exercise);
  const focus: string[] = [];
  const matches = (pattern: RegExp) => pattern.test(text);

  if (exercise.category === "stretching") focus.push("Mobility & stretch");

  if (bodyPart === "Chest") {
    if (matches(/incline|clavicular|low pulley|low-to-high/)) focus.push("Upper chest");
    if (matches(/decline|chest dip|dips|high pulley|high-to-low/)) focus.push("Lower chest");
    if (!focus.includes("Upper chest") && !focus.includes("Lower chest") && exercise.category !== "stretching") {
      focus.push("Middle chest");
    }
    if (matches(/fly|flye|cross[- ]?over|butterfly|pec deck|squeeze|svend/)) focus.push("Fly & squeeze");
  }

  if (bodyPart === "Back") {
    if (muscles.includes("lats")) focus.push("Lats");
    if (muscles.includes("middle back")) focus.push("Middle back");
    if (muscles.includes("lower back")) focus.push("Lower back");
    if (muscles.includes("traps")) focus.push("Traps");
  }

  if (bodyPart === "Legs") {
    if (muscles.includes("quadriceps")) focus.push("Quadriceps");
    if (muscles.includes("hamstrings")) focus.push("Hamstrings");
    if (muscles.includes("glutes")) focus.push("Glutes");
    if (muscles.includes("calves")) focus.push("Calves");
    if (muscles.includes("adductors")) focus.push("Adductors");
    if (muscles.includes("abductors")) focus.push("Abductors");
  }

  if (bodyPart === "Shoulders") {
    if (matches(/front raise|anterior delt/)) focus.push("Front delts");
    if (matches(/lateral|side raise|upright row/)) focus.push("Side delts");
    if (matches(/rear delt|reverse fly|reverse machine|face pull|posterior delt|bent over.*raise/)) focus.push("Rear delts");
    if (matches(/overhead press|military press|shoulder press|push press|jerk|handstand push/)) focus.push("Overhead press");
    if (matches(/rotator|external rotation|internal rotation|cuban|scapular/)) focus.push("Rotator cuff");
    if (focus.length === 0 || (focus.length === 1 && focus[0] === "Mobility & stretch")) focus.push("Full shoulder");
  }

  if (bodyPart === "Arms") {
    if (muscles.includes("biceps")) focus.push("Biceps");
    if (matches(/hammer curl|reverse curl|zottman|brachialis/)) focus.push("Brachialis");
    if (muscles.includes("triceps")) focus.push("Triceps");
    if (muscles.includes("forearms") || matches(/wrist|grip|farmer/)) focus.push("Forearms & grip");
  }

  if (bodyPart === "Core") {
    if (matches(/twist|oblique|side bend|side plank|pallof|wood chop|windmill|landmine 180/)) focus.push("Obliques & rotation");
    if (matches(/plank|ab roller|rollout|body saw|dead bug/)) focus.push("Anti-extension");
    if (matches(/leg raise|knee raise|reverse crunch|flutter|scissor|hip raise/)) focus.push("Lower abs / hip flexion");
    if (muscles.includes("lower back")) focus.push("Lower back");
    if (muscles.includes("abdominals") && !focus.some((item) => item === "Anti-extension" || item === "Lower abs / hip flexion" || item === "Obliques & rotation")) {
      focus.push("Abs & flexion");
    }
  }

  return unique(focus);
}

export const exercises: Exercise[] = (sourceCatalog as SourceExercise[])
  .map((exercise) => {
    const allMuscles = unique([...exercise.primaryMuscles, ...exercise.secondaryMuscles]);
    const bodyParts = bodyPartOrder.filter((bodyPart) => hasAny(allMuscles, bodyPartMuscles[bodyPart]));
    const primaryBodyParts = bodyPartOrder.filter((bodyPart) => hasAny(exercise.primaryMuscles, bodyPartMuscles[bodyPart]));
    const focus = Object.fromEntries(bodyParts.map((bodyPart) => [bodyPart, focusFor(bodyPart, exercise)])) as Partial<Record<BodyPart, string[]>>;
    const firstImage = exercise.images[0];
    const secondImage = exercise.images[1] ?? firstImage;

    return {
      ...exercise,
      bodyParts,
      primaryBodyParts,
      focus,
      imageUrls: [`${IMAGE_BASE}${encodeImagePath(firstImage)}`, `${IMAGE_BASE}${encodeImagePath(secondImage)}`] as [string, string],
      searchText: [
        exercise.name,
        exercise.equipment ?? "no equipment",
        exercise.level,
        exercise.category,
        exercise.mechanic ?? "",
        exercise.force ?? "",
        ...exercise.primaryMuscles,
        ...exercise.secondaryMuscles,
        ...Object.values(focus).flat(),
      ].join(" ").toLowerCase(),
    };
  })
  .filter((exercise) => exercise.bodyParts.length > 0);

export const totalSourceExercises = (sourceCatalog as SourceExercise[]).length;

export const bodyPartCounts = Object.fromEntries(
  bodyPartOrder.map((bodyPart) => [bodyPart, exercises.filter((exercise) => exercise.bodyParts.includes(bodyPart)).length]),
) as Record<BodyPart, number>;

export const primaryBodyPartCounts = Object.fromEntries(
  bodyPartOrder.map((bodyPart) => [bodyPart, exercises.filter((exercise) => exercise.primaryBodyParts.includes(bodyPart)).length]),
) as Record<BodyPart, number>;

export const equipmentOptions = unique(exercises.map((exercise) => exercise.equipment ?? "other")).sort();
export const categoryOptions = unique(exercises.map((exercise) => exercise.category)).sort();
export const levelOptions = ["beginner", "intermediate", "expert"] as const;

export const heroExercise = exercises.find((exercise) => exercise.id === "Barbell_Bench_Press_-_Medium_Grip") ?? exercises[0];

export function label(value: string | null) {
  if (!value) return "Other";
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function focusOptionsFor(bodyPart: BodyPart) {
  const available = new Set(exercises.flatMap((exercise) => exercise.focus[bodyPart] ?? []));
  return bodyPartInfo[bodyPart].focusOrder.filter((item) => available.has(item));
}
