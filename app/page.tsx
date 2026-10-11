"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  bodyPartCounts,
  bodyPartInfo,
  bodyPartOrder,
  categoryOptions,
  equipmentOptions,
  exercises,
  focusOptionsFor,
  heroExercise,
  label,
  levelOptions,
  primaryBodyPartCounts,
  totalSourceExercises,
  type BodyPart,
  type Exercise,
} from "./exercise-data";
import { trainingFitFor, workoutPlans } from "./workout-plans";

const PAGE_SIZE = 24;
const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise]));

type ExerciseVisualProps = {
  exercise: Exercise;
  priority?: boolean;
  mode?: "card" | "hero" | "modal";
};

function ExerciseVisual({ exercise, priority = false, mode = "card" }: ExerciseVisualProps) {
  const [failedImages, setFailedImages] = useState([false, false]);
  const initials = exercise.name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("");

  return (
    <div className={`exercise-visual visual-${mode}`}>
      {exercise.imageUrls.map((imageUrl, index) => {
        const position = index === 0 ? "Start" : "Finish";
        return (
          <div className="form-frame" key={`${exercise.id}-${position}`}>
            <span className="position-label">{position}</span>
            {failedImages[index] ? (
              <div className="image-fallback" role="img" aria-label={`${exercise.name} ${position.toLowerCase()} image unavailable`}>
                <strong>{initials}</strong>
                <span>Image unavailable</span>
              </div>
            ) : (
              <Image
                src={imageUrl}
                alt={`${exercise.name}: ${position.toLowerCase()} position`}
                fill
                priority={priority && index === 0}
                unoptimized
                sizes={mode === "modal" ? "(max-width: 720px) 50vw, 390px" : mode === "hero" ? "(max-width: 820px) 46vw, 300px" : "(max-width: 560px) 50vw, (max-width: 980px) 25vw, 17vw"}
                onError={() => {
                  setFailedImages((current) => current.map((failed, imageIndex) => imageIndex === index ? true : failed));
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TrainingFit({ rating }: { rating: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <span className="training-fit" aria-label={`${rating} out of 5 training fit stars`}>
      <span aria-hidden="true">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>
      <small>{rating}/5 training fit</small>
    </span>
  );
}

function ExerciseCard({ exercise, bodyPart, onOpen }: { exercise: Exercise; bodyPart: BodyPart; onOpen: (exercise: Exercise, trigger: HTMLButtonElement) => void }) {
  const isPrimary = exercise.primaryBodyParts.includes(bodyPart);
  const focus = exercise.focus[bodyPart] ?? [];
  const rating = trainingFitFor(exercise, bodyPart);

  return (
    <button
      className="exercise-card"
      type="button"
      onClick={(event) => onOpen(exercise, event.currentTarget)}
      aria-label={`Open the ${exercise.name} form guide, ${rating} out of 5 training fit stars`}
    >
      <ExerciseVisual exercise={exercise} />
      <div className="card-body">
        <div className="card-kicker">
          <span className={isPrimary ? "target-badge primary" : "target-badge"}>{isPrimary ? "Primary target" : "Supporting target"}</span>
          <span>{label(exercise.level)}</span>
        </div>
        <TrainingFit rating={rating} />
        <h3>{exercise.name}</h3>
        <p className="card-muscles">{exercise.primaryMuscles.map(label).join(" · ")}</p>
        <div className="focus-tags">
          {focus.slice(0, 2).map((item) => <span key={item}>{item}</span>)}
        </div>
        <div className="card-meta">
          <span>{label(exercise.equipment)}</span>
          <span className="view-guide">View guide <b aria-hidden="true">↗</b></span>
        </div>
      </div>
    </button>
  );
}

export default function Home() {
  const [activeBodyPart, setActiveBodyPart] = useState<BodyPart>("Chest");
  const [activeFocus, setActiveFocus] = useState("All");
  const [query, setQuery] = useState("");
  const [equipment, setEquipment] = useState("all");
  const [level, setLevel] = useState("all");
  const [category, setCategory] = useState("all");
  const [targetMode, setTargetMode] = useState<"all" | "primary">("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const selectedExercise = exercises.find((exercise) => exercise.id === selectedId) ?? null;
  const cleanedQuery = query.trim().toLowerCase();
  const groupInfo = bodyPartInfo[activeBodyPart];
  const workoutPlan = workoutPlans[activeBodyPart];
  const planSets = workoutPlan.exercises.reduce((total, item) => total + item.sets, 0);
  const focusOptions = focusOptionsFor(activeBodyPart);

  const baseResults = useMemo(() => {
    return exercises
      .filter((exercise) => exercise.bodyParts.includes(activeBodyPart))
      .filter((exercise) => targetMode === "all" || exercise.primaryBodyParts.includes(activeBodyPart))
      .filter((exercise) => equipment === "all" || (exercise.equipment ?? "other") === equipment)
      .filter((exercise) => level === "all" || exercise.level === level)
      .filter((exercise) => category === "all" || exercise.category === category)
      .filter((exercise) => !cleanedQuery || exercise.searchText.includes(cleanedQuery));
  }, [activeBodyPart, category, cleanedQuery, equipment, level, targetMode]);

  const focusCounts = useMemo(() => Object.fromEntries(
    focusOptions.map((focus) => [focus, baseResults.filter((exercise) => exercise.focus[activeBodyPart]?.includes(focus)).length]),
  ) as Record<string, number>, [activeBodyPart, baseResults, focusOptions]);

  const filteredExercises = useMemo(() => {
    return baseResults
      .filter((exercise) => activeFocus === "All" || exercise.focus[activeBodyPart]?.includes(activeFocus))
      .sort((first, second) => {
        const ratingDifference = trainingFitFor(second, activeBodyPart) - trainingFitFor(first, activeBodyPart);
        if (ratingDifference !== 0) return ratingDifference;
        const firstPlanIndex = workoutPlan.exercises.findIndex((item) => item.id === first.id);
        const secondPlanIndex = workoutPlan.exercises.findIndex((item) => item.id === second.id);
        if (firstPlanIndex !== -1 || secondPlanIndex !== -1) {
          if (firstPlanIndex === -1) return 1;
          if (secondPlanIndex === -1) return -1;
          return firstPlanIndex - secondPlanIndex;
        }
        const primaryDifference = Number(second.primaryBodyParts.includes(activeBodyPart)) - Number(first.primaryBodyParts.includes(activeBodyPart));
        if (primaryDifference !== 0) return primaryDifference;
        return first.name.localeCompare(second.name);
      });
  }, [activeBodyPart, activeFocus, baseResults, workoutPlan]);

  const visibleExercises = filteredExercises.slice(0, visibleCount);
  const filtersActive = Boolean(cleanedQuery || equipment !== "all" || level !== "all" || category !== "all" || targetMode !== "all" || activeFocus !== "All");

  useEffect(() => {
    if (!selectedId) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      lastTriggerRef.current?.focus();
    };
  }, [selectedId]);

  const chooseBodyPart = (bodyPart: BodyPart) => {
    setActiveBodyPart(bodyPart);
    setActiveFocus("All");
    setQuery("");
    setVisibleCount(PAGE_SIZE);
    window.requestAnimationFrame(() => {
      document.getElementById("workout-plan")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const resetFilters = () => {
    setActiveFocus("All");
    setQuery("");
    setEquipment("all");
    setLevel("all");
    setCategory("all");
    setTargetMode("all");
    setVisibleCount(PAGE_SIZE);
  };

  const openExercise = (exercise: Exercise, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setSelectedId(exercise.id);
  };

  return (
    <main id="top">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="RepReady home">
          <span className="brand-mark">R</span>
          <span>REPREADY</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#muscle-groups">Body parts</a>
          <a href="#workout-plan">Workout plan</a>
          <a href="#exercise-library">Exercise library</a>
          <a href="#safety">Form safety</a>
        </nav>
        <a className="header-action" href="#exercise-library">Browse {totalSourceExercises} guides <span aria-hidden="true">↘</span></a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Exercise reference library</p>
          <h1>One body part.<br /><em>Many ways to train it.</em></h1>
          <p className="hero-description">
            Pick chest, back, legs, shoulders, arms or core for a complete workout plan. Then explore hundreds of exercises by sub-muscle, equipment and level, with form guides for every move.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#muscle-groups">Choose a body part <span aria-hidden="true">→</span></a>
            <a className="text-link" href="#exercise-library">Explore chest</a>
          </div>
          <div className="hero-stats" aria-label="Library summary">
            <span><b>{totalSourceExercises}</b> exercise guides</span>
            <span><b>50+</b> for every body part</span>
            <span><b>02</b> form positions</span>
          </div>
        </div>

        <div className="hero-art">
          <ExerciseVisual exercise={heroExercise} mode="hero" priority />
          <div className="hero-image-caption"><span>{heroExercise.name}</span><b>Start / finish</b></div>
          <div className="guide-sticker">
            <p>This is a reference</p>
            <strong>NO<br />TRACKING</strong>
            <span>No checkmarks. No streaks. Just clear exercise guides.</span>
          </div>
        </div>
      </section>

      <section className="group-section" id="muscle-groups">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark"><span /> Pick your first area</p>
            <h2>What are you training?</h2>
          </div>
          <p>Choose an area to see its full workout and exercise library. Switch areas whenever you want another plan.</p>
        </div>

        <div className="group-picker" aria-label="Choose a body part">
          {bodyPartOrder.map((bodyPart, index) => (
            <button
              type="button"
              className={`group-button accent-${bodyPartInfo[bodyPart].accent} ${activeBodyPart === bodyPart ? "active" : ""}`}
              aria-pressed={activeBodyPart === bodyPart}
              onClick={() => chooseBodyPart(bodyPart)}
              key={bodyPart}
            >
              <span>{String(index + 1).padStart(2, "0")} / {bodyPartInfo[bodyPart].short}</span>
              <strong>{bodyPart}</strong>
              <small>{primaryBodyPartCounts[bodyPart]} primary · {bodyPartCounts[bodyPart]} total</small>
            </button>
          ))}
        </div>
      </section>

      <section className={`workout-section accent-${groupInfo.accent}`} id="workout-plan" aria-labelledby="workout-title">
        <div className="workout-heading">
          <div>
            <p className="eyebrow dark"><span /> Ready-to-use session</p>
            <h2 id="workout-title">Full {activeBodyPart.toLowerCase()} workout</h2>
            <p>{workoutPlan.summary}</p>
          </div>
          <div className="workout-summary" aria-label="Workout at a glance">
            <span><b>{workoutPlan.exercises.length}</b> exercises</span>
            <span><b>{planSets}</b> working sets</span>
            <span><b>1</b> session</span>
          </div>
        </div>

        <div className="plan-intro">
          <p>Do these in order. Warm up first, then choose a weight you can control for every rep. If you are new to lifting, start with fewer sets and build up gradually.</p>
          <span>Stars = how well each exercise fits this plan, not user reviews.</span>
        </div>

        <ol className="plan-list">
          {workoutPlan.exercises.map((item, index) => {
            const exercise = exerciseById.get(item.id);
            if (!exercise) return null;
            return (
              <li className="plan-item" key={item.id}>
                <span className="plan-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="plan-main">
                  <div className="plan-item-top">
                    <span className="plan-focus">{item.focus}</span>
                    <span className="plan-rating" aria-label={`${item.rating} out of 5 plan fit stars`}>
                      <span aria-hidden="true">{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</span>
                      <small>{item.rating}/5 plan fit</small>
                    </span>
                  </div>
                  <h3>{exercise.name}</h3>
                  <p>{item.why}</p>
                  <div className="plan-prescription">
                    <span><b>{item.sets} sets</b> × {item.reps}</span>
                    <span>Rest {item.rest}</span>
                    <span>{label(exercise.equipment)}</span>
                  </div>
                </div>
                <button className="plan-guide" type="button" onClick={(event) => openExercise(exercise, event.currentTarget)} aria-label={`View form guide for ${exercise.name}`}>
                  View form <span aria-hidden="true">↗</span>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="plan-footnote">This is a sample workout for healthy adults. Allow recovery before training the same area hard again, and adjust movements to your ability and equipment. <a href="https://acsm.org/resistance-training-guidelines-update-2026/" target="_blank" rel="noreferrer">ACSM training guidance ↗</a></p>
      </section>

      <section className="library" id="exercise-library">
        <div className="library-heading">
          <div>
            <p className="eyebrow dark"><span /> {bodyPartCounts[activeBodyPart]} movements in this library</p>
            <h2>{activeBodyPart} exercises</h2>
          </div>
          <p>{groupInfo.description} Primary-target exercises are shown before movements where {activeBodyPart.toLowerCase()} is a supporting muscle.</p>
        </div>

        <div className="filter-panel">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <span className="sr-only">Search within {activeBodyPart.toLowerCase()} exercises</span>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder={`Search ${activeBodyPart.toLowerCase()}, exercise or equipment`}
            />
          </label>

          <div className="select-filters">
            <label>
              <span>Target role</span>
              <select value={targetMode} onChange={(event) => { setTargetMode(event.target.value as "all" | "primary"); setVisibleCount(PAGE_SIZE); }}>
                <option value="all">Primary + supporting</option>
                <option value="primary">Primary target only</option>
              </select>
            </label>
            <label>
              <span>Equipment</span>
              <select value={equipment} onChange={(event) => { setEquipment(event.target.value); setVisibleCount(PAGE_SIZE); }}>
                <option value="all">All equipment</option>
                {equipmentOptions.map((item) => <option value={item} key={item}>{label(item)}</option>)}
              </select>
            </label>
            <label>
              <span>Difficulty</span>
              <select value={level} onChange={(event) => { setLevel(event.target.value); setVisibleCount(PAGE_SIZE); }}>
                <option value="all">All levels</option>
                {levelOptions.map((item) => <option value={item} key={item}>{label(item)}</option>)}
              </select>
            </label>
            <label>
              <span>Training type</span>
              <select value={category} onChange={(event) => { setCategory(event.target.value); setVisibleCount(PAGE_SIZE); }}>
                <option value="all">All types</option>
                {categoryOptions.map((item) => <option value={item} key={item}>{label(item)}</option>)}
              </select>
            </label>
          </div>

          {filtersActive && <button className="reset-filters" type="button" onClick={resetFilters}>Reset filters ×</button>}
        </div>

        <div className={`focus-panel accent-${groupInfo.accent}`}>
          <div>
            <span>Sub-muscle / focus</span>
            <p>Choose an area to narrow the library.</p>
          </div>
          <div className="focus-chips" aria-label={`${activeBodyPart} focus filters`}>
            <button
              type="button"
              className={activeFocus === "All" ? "active" : ""}
              aria-pressed={activeFocus === "All"}
              onClick={() => { setActiveFocus("All"); setVisibleCount(PAGE_SIZE); }}
            >
              All <span>{baseResults.length}</span>
            </button>
            {focusOptions.map((focus) => (
              <button
                type="button"
                className={activeFocus === focus ? "active" : ""}
                aria-pressed={activeFocus === focus}
                onClick={() => { setActiveFocus(focus); setVisibleCount(PAGE_SIZE); }}
                key={focus}
              >
                {focus} <span>{focusCounts[focus] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        {groupInfo.note && (
          <aside className="anatomy-note">
            <span>About the “inner chest”</span>
            <p>{groupInfo.note}</p>
          </aside>
        )}

        <div className="results-bar" aria-live="polite">
          <p><strong>{filteredExercises.length}</strong> {filteredExercises.length === 1 ? "exercise" : "exercises"} found</p>
          <span>Highest rated first · Showing {Math.min(visibleCount, filteredExercises.length)} now</span>
        </div>
        <p className="rating-explanation">Training fit is an editorial score based on plan selection, primary muscle role, movement type, level, and guide detail. Stars are not user reviews.</p>

        {visibleExercises.length > 0 ? (
          <>
            <div className="exercise-grid">
              {visibleExercises.map((exercise) => (
                <ExerciseCard exercise={exercise} bodyPart={activeBodyPart} onOpen={openExercise} key={exercise.id} />
              ))}
            </div>
            {visibleCount < filteredExercises.length && (
              <div className="load-more-wrap">
                <button className="load-more" type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                  Show {Math.min(PAGE_SIZE, filteredExercises.length - visibleCount)} more <span aria-hidden="true">↓</span>
                </button>
                <p>{filteredExercises.length - visibleCount} still hidden</p>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <strong>No matching exercise</strong>
            <p>Try removing one filter, choosing another sub-muscle, or searching a broader word.</p>
            <button type="button" onClick={resetFilters}>Reset {activeBodyPart.toLowerCase()} filters</button>
          </div>
        )}
      </section>

      <section className="reading-guide">
        <div>
          <p className="eyebrow"><span /> Inside every exercise</p>
          <h2>See it.<br /><em>Understand it.</em><br />Then lift.</h2>
        </div>
        <div className="reading-steps">
          <article><span>01</span><div><h3>Compare both positions</h3><p>Look at the feet, joint angles, grip and torso in the start and finish photos before you set up.</p></div></article>
          <article><span>02</span><div><h3>Read every step</h3><p>The full guide explains setup, movement direction and how to return under control.</p></div></article>
          <article><span>03</span><div><h3>Check the muscle role</h3><p>Primary muscles drive the exercise. Secondary muscles assist or stabilize, which is why one movement can appear under more than one body part.</p></div></article>
        </div>
      </section>

      <section className="safety-note" id="safety" aria-label="Safety note">
        <span aria-hidden="true">!</span>
        <div>
          <strong>Use the library as a visual reference—not a medical assessment.</strong>
          <p>Begin with a load you can control. Photos show key positions, not every moment of a repetition. Stop for sharp pain, dizziness or unusual discomfort, and ask a qualified coach or clinician when an exercise does not suit your mobility, injury history or equipment.</p>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark">R</span><span>REPREADY</span></a>
        <p>Exercise data and images from <a href="https://github.com/yuhonas/free-exercise-db" target="_blank" rel="noreferrer">Free Exercise DB</a> (Unlicense).</p>
        <a href="#top">Back to top ↑</a>
      </footer>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        <a href="#muscle-groups"><span aria-hidden="true">◎</span>Body parts</a>
        <a href="#workout-plan"><span aria-hidden="true">★</span>Plan</a>
        <a href="#exercise-library"><span aria-hidden="true">⌕</span>Exercises</a>
        <a href="#safety"><span aria-hidden="true">!</span>Safety</a>
      </nav>

      {selectedExercise && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedId(null);
        }}>
          <section className="exercise-modal" role="dialog" aria-modal="true" aria-labelledby="exercise-title" aria-describedby="exercise-summary">
            <div className="modal-header">
              <div>
                {selectedExercise.bodyParts.map((bodyPart) => <span key={bodyPart}>{bodyPart}</span>)}
                <b>Form guide</b>
              </div>
              <button ref={closeButtonRef} className="close-button" type="button" aria-label="Close exercise guide" onClick={() => setSelectedId(null)}>×</button>
            </div>

            <ExerciseVisual exercise={selectedExercise} mode="modal" />

            <div className="modal-content">
              <div className="modal-title-row">
                <div>
                  <p>{label(selectedExercise.category)} · {label(selectedExercise.level)}</p>
                  <TrainingFit rating={trainingFitFor(selectedExercise, activeBodyPart)} />
                  <h2 id="exercise-title">{selectedExercise.name}</h2>
                </div>
                <div className="modal-focus-list">
                  <span>{activeBodyPart} focus</span>
                  <div>{(selectedExercise.focus[activeBodyPart] ?? []).map((item) => <b key={item}>{item}</b>)}</div>
                </div>
              </div>

              <p className="modal-overview" id="exercise-summary">
                Study the two key positions, then follow the steps below. Use a light practice load until the setup and path feel controlled.
              </p>

              <div className="movement-facts" aria-label="Exercise details">
                <span><small>Equipment</small><b>{label(selectedExercise.equipment)}</b></span>
                <span><small>Difficulty</small><b>{label(selectedExercise.level)}</b></span>
                <span><small>Mechanic</small><b>{label(selectedExercise.mechanic)}</b></span>
                <span><small>Force</small><b>{label(selectedExercise.force)}</b></span>
              </div>

              <div className="muscle-panel">
                <div>
                  <span>Primary muscles</span>
                  <div>{selectedExercise.primaryMuscles.map((muscle) => <b key={muscle}>{label(muscle)}</b>)}</div>
                </div>
                <div>
                  <span>Secondary muscles</span>
                  <div>
                    {selectedExercise.secondaryMuscles.length > 0
                      ? selectedExercise.secondaryMuscles.map((muscle) => <b key={muscle}>{label(muscle)}</b>)
                      : <p>No secondary muscles are listed for this movement.</p>}
                  </div>
                </div>
              </div>

              <div className="instruction-block">
                <div className="block-heading">
                  <span>Step by step</span>
                  <h3>How to do it</h3>
                </div>
                {selectedExercise.instructions.length > 0 ? (
                  <ol>{selectedExercise.instructions.map((step, index) => <li key={`${index}-${step}`}><span>{step}</span></li>)}</ol>
                ) : (
                  <p className="missing-instructions">This catalog entry has no written steps. Use the photos only as a starting reference and ask a qualified trainer to demonstrate the movement.</p>
                )}
              </div>

              <div className="form-checklist">
                <div>
                  <span>Before the first working set</span>
                  <h3>Three form checks</h3>
                </div>
                <ul>
                  <li><b>Setup</b><span>Match the supports, stance and grip shown in the start photo.</span></li>
                  <li><b>Control</b><span>Use a load that lets you reach the finish position without swinging or rushing.</span></li>
                  <li><b>Comfort</b><span>Stay inside a pain-free range and stop if a joint feels sharp or unstable.</span></li>
                </ul>
              </div>

              <p className="source-note">Guide text and images are supplied by the public-domain-labelled Free Exercise DB catalog. Exercise entries can vary in detail; use professional coaching when you are unsure.</p>
              <button className="back-button" type="button" onClick={() => setSelectedId(null)}>← Back to exercises</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
