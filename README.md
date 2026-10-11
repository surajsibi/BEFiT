# RepReady

A responsive Next.js exercise reference with 873 movement guides. Chest, back, legs, shoulders, arms, and core each have a sample workout and more than 50 relevant exercises. Users can filter the library by sub-muscle or movement focus, equipment, difficulty, training type, and primary/supporting muscle role.

Each exercise opens into a read-only guide with start-and-finish images, primary and secondary muscles, equipment, difficulty, movement type, and complete step-by-step instructions. There are no completion markers, workout streaks, accounts, or saved progress.

## Workouts and ratings

Choosing a body part shows an ordered sample session with sets, reps, rest times, and links to each form guide. The chest session includes upper, middle, and lower pec emphasis. Plans are defined in `app/workout-plans.ts` and are general examples, not personalized prescriptions.

Every exercise in the selected library receives a 1–5 star training-fit score for that body part. Plan picks receive their curated score; other movements are scored from primary versus supporting muscle role, movement type, difficulty, and guide detail. Results appear from highest to lowest score. Ties favor plan picks, then primary-target exercises. These are editorial scores, **not user reviews**.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm run build
```

## Deploy to Netlify

1. Push this folder to a GitHub, GitLab, or Bitbucket repository.
2. In Netlify, choose **Add new project** and import that repository.
3. Netlify will detect Next.js. The included `netlify.toml` sets `npm run build` as the build command and `.next` as the publish directory.
4. Deploy the site.

The app is a read-only reference and does not require a database, sign-in, or environment variables.

## Exercise data and images

The local catalog is sourced from [Free Exercise DB](https://github.com/yuhonas/free-exercise-db) at commit `b0eed061e1c832b3ed815fbaa4b45b3cdc14df49`. The repository labels the dataset public domain under the Unlicense. Catalog JSON is bundled locally; start/end images are loaded from jsDelivr using that pinned commit.

Because the images are hosted externally, visitors need an internet connection to see them. The interface provides an image-unavailable fallback if the CDN cannot be reached.
