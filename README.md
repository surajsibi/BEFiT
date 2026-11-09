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


## beefit Android download

The home page includes a beefit download section, linked from the header,
hero and mobile navigation. It shows "Android download coming soon" until a
real APK or a hosted download URL is supplied. The website and Android app
remain separate: the APK installs the workout-tracking app.

Build the renamed app from the GymMane Flutter project after setting up Flutter
and the Android SDK:

```powershell
cd "C:\Users\Suraj\Desktop\New folder\GymMane"
flutter pub get
flutter build apk --release
```

The result is `build/app/outputs/flutter-apk/app-release.apk`.

Choose one way to publish that APK:

- **With the website:** copy the APK to `public/downloads/beefit.apk` in this
  website project, then rebuild and redeploy. The home page detects it at build
  time and enables the download. Include the APK in the deployment's source.
- **With a file host:** upload the renamed app's APK to a release or file host,
  then set `NEXT_PUBLIC_BEEFIT_APK_URL` to its full HTTPS file-download URL in
  Netlify's environment variables (or `.env.local` for local development).
  Rebuild and redeploy after changing the URL. This option avoids storing a
  large binary in the website repository.

The website address is https://befittt.netlify.app. With the first option, the
APK address after deployment will be https://befittt.netlify.app/downloads/beefit.apk.
That link is not available until the real file is included in a deployment.

Use an APK built from the renamed source; the original upstream GymMane release
still has the original name. Keep the same signing key for future app updates.
For public releases, configure release signing in the Flutter project before
building; its current fallback uses the debug signing key.

On an Android phone, open the website, select **Get Android app**, download the
APK and open it. If Android asks, allow the browser or Files app to install it,
then tap **Install**. Android 7.0 or newer is required; this APK is not for iPhone.

References: [Flutter Android builds](https://docs.flutter.dev/deployment/android)
and [Next.js static files](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder).

The Netlify configuration selects the signed beefit 2.1.0 APK hosted in this project's
[GitHub release](https://github.com/surajsibi/GymGuide/releases/tag/beefit-v2.1.0).
The release must be published before deploying this download configuration.
