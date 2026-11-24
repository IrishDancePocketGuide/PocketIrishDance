# iPhone app (App Store)

This folder turns the Pocket Irish Dance web app into an iPhone app with
[Capacitor](https://capacitorjs.com). The app itself is still the web app in the folder above:
change those files as usual, and the next iPhone build picks them up.

No Mac is needed. Builds run on Apple's tools in GitHub's cloud:

- **iPhone app - check it builds** runs by itself when files change.
- **iPhone app - send to Apple** (Actions tab > Run workflow) builds, signs and uploads a new
  version to App Store Connect / TestFlight. It needs four secrets; see the top of
  `.github/workflows/ios-release.yml`.

What the iPhone app adds on top of the website:

- Everything is inside the app, so it works offline from the first launch.
- Feis reminders: a notification a week before and the evening before a feis.
- The iPhone share sheet for invites, and for saving backup files to Files, AirDrop or email.
- Haptic taps for 1st places.

App ID: `com.pocketirishdance.app`. Icons and launch screen come from `assets/`
(regenerate with `npx capacitor-assets generate --ios`).

When the website moves to pocketirishdance.com, change `publicUrl` in `config.js`.
