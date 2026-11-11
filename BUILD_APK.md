# ProjectPartner – Android APK

The app is wrapped with **Capacitor**. The APK contains the React front-end; it talks to your
existing Express backend over the network (the backend is *not* inside the APK).

## 1. Make the backend reachable from the phone
Pick one:

* **Same Wi-Fi (easiest):** run `run.bat` / `npm run dev` on your PC. Find the PC's IP
  (`ipconfig` -> IPv4, e.g. `192.168.1.20`). Allow Node through Windows Firewall for port 5000.
  Server address in the app: `http://192.168.1.20:5000`
* **Hosted:** deploy `server/` (Render, Railway, a VPS ...) and use its URL. Note: the built-in
  data store lives in memory and resets on restart – set `MONGODB_URI` in `server/.env`
  (MongoDB Atlas) if you want data to persist.

## 2. Build the APK

### Option A – no Android tools needed (GitHub Actions)
1. Push this folder to a GitHub repo.
2. Repo -> **Actions** -> **Build Android APK** -> **Run workflow**
   (optionally enter your hosted backend URL so the app is pre-configured).
3. When finished, download the **ProjectPartner-APK** artifact -> `app-debug.apk`.

### Option B – locally (Node 20+, JDK 17, Android Studio / Android SDK)
```
cd client
npm install
npm run build
npm run android:add        # first time only
npm run android:apk        # APK: client/android/app/build/outputs/apk/debug/app-debug.apk
```
(`npm run android:open` opens the project in Android Studio instead.)

## 3. Install
Copy `app-debug.apk` to the phone, open it, allow "install unknown apps" when asked.
On first launch enter the server address (menu -> *Server settings* changes it later).

## Notes
* `app-debug.apk` is debug-signed – fine for installing on your own phone. For Google Play you
  need a release build signed with your own keystore.
* After changing front-end code: `npm run android:sync` (or re-run the workflow).
* The server's CORS list already allows the app (`http://localhost`). Add other origins with
  `EXTRA_ORIGINS=https://a.com,https://b.com` in `server/.env`.
