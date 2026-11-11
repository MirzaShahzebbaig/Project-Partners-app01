// Run after `cap add android` / `cap sync android`.
// - allows plain-http backends (e.g. http://192.168.x.x:5000 on your Wi-Fi)
// - makes the keyboard resize the page instead of covering inputs
import fs from 'fs';
import path from 'path';

const manifest = path.resolve('android/app/src/main/AndroidManifest.xml');
if (!fs.existsSync(manifest)) {
  console.log('No android/ project yet - run "npm run android:add" first.');
  process.exit(0);
}
let xml = fs.readFileSync(manifest, 'utf8');
if (!xml.includes('usesCleartextTraffic')) {
  xml = xml.replace('<application', '<application\n        android:usesCleartextTraffic="true"');
}
if (!xml.includes('windowSoftInputMode')) {
  xml = xml.replace('<activity', '<activity\n            android:windowSoftInputMode="adjustResize"');
}
fs.writeFileSync(manifest, xml);
console.log('AndroidManifest.xml patched.');
