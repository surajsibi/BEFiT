const apkUrl = process.env.NEXT_PUBLIC_BEEFIT_APK_URL || "";

export default function AppDownload() {
  return (
    <section className="app-download" id="download-app" aria-labelledby="app-download-title">
      <div className="app-download-copy">
        <p className="eyebrow dark"><span /> Your training, on your phone</p>
        <h2 id="app-download-title">Meet <span>beefit</span></h2>
        <p className="app-download-description">
          Keep your sets, weights and progress together. Plan a workout, time your
          rest and pick up where you left off, even when you&apos;re offline.
        </p>
        <ul className="app-download-features" aria-label="App features">
          <li>Workout log</li>
          <li>Rest timer</li>
          <li>Progress history</li>
        </ul>
        <p className="app-download-credit">Based on GymMane by InlitX.</p>
      </div>

      <div className="app-download-card">
        <div className="app-download-platform">
          <span className="app-download-symbol" aria-hidden="true">↓</span>
          <div><strong>beefit for Android</strong><span>Free · Android 7.0 or newer</span></div>
        </div>
        {apkUrl ? (
          <>
            <a className="app-download-button" href={apkUrl} download="beefit.apk" aria-describedby="app-install-help">
              Download for Android <span aria-hidden="true">↓</span>
            </a>
            <p className="app-download-status">Android app (.apk) · Works offline</p>
            <details className="app-install-help" id="app-install-help">
              <summary>How to install on your phone</summary>
              <ol>
                <li>Open this website on your Android phone and tap the download button.</li>
                <li>Open the downloaded APK from your browser or Files app.</li>
                <li>If prompted, allow this browser or Files app to install apps, then tap Install.</li>
              </ol>
            </details>
          </>
        ) : (
          <>
            <button className="app-download-button" type="button" disabled aria-describedby="app-download-status">
              Android download coming soon
            </button>
            <p className="app-download-status" id="app-download-status">
              We&apos;re getting the Android app ready. The download will appear here when it&apos;s available.
            </p>
          </>
        )}
        <p className="app-download-compatibility">Android only. An iPhone version is not available yet.</p>
      </div>
    </section>
  );
}
