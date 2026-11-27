# RetailPro Mini — Chicken Shop POS (v1.1.0)

A mobile-first app for billing, stock, purchases and reports in a poultry shop. The same app runs on Android phones and on desktop browsers, and all devices share one Firebase project. Bills can be made with no internet and sync when the connection returns.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app (one file) |
| `sw.js` | Service worker: lets the app open with no internet |
| `manifest.json`, `icon-192.png`, `icon-512.png` | "Install app" on Android |
| `firestore.rules` | Security rules for Owner / Manager / Cashier |

## Roles

| | Cashier | Manager | Owner |
|---|:-:|:-:|:-:|
| New sale, print or share bill | ✓ | ✓ | ✓ |
| See own bills, see stock | ✓ | ✓ | ✓ |
| All bills, void a bill | | ✓ | ✓ |
| Purchase, processing, expenses, stock adjust | | ✓ | ✓ |
| Change today's rates | | ✓ | ✓ |
| Reports, CSV export, day closing | | ✓ | ✓ |
| Add products, shop details, staff logins | | | ✓ |

## One-time setup (about 15 minutes)

1. **Firebase console → Build → Authentication → Sign-in method** → turn on **Email/Password**.
2. **Build → Firestore Database → Create database**. Choose the location `asia-south1 (Mumbai)` and start in production mode.
3. **Firestore → Rules**: paste the contents of `firestore.rules`, then click **Publish**.
4. **Project settings → Your apps → Web app (</>)**. Copy the `firebaseConfig` object into `index.html`, replacing `const FIREBASE_CONFIG = null;` near the top of the script.
   If you skip this step, each phone shows a "Connect your Firebase project" box where the config can be pasted.
5. Upload all six files to a GitHub Pages repository (or Firebase Hosting). The app must be served over **HTTPS** so it can be installed and work offline.
6. On the owner's phone, open the URL in Chrome and tap **First time? Set up a new shop**. Enter the shop name, your name, a username and a password. The app adds 9 default products.
7. **More → Staff & logins → Add staff login** for each cashier or manager. Creating a login needs internet.
8. On **each** phone, open the URL in Chrome and choose **⋮ → Add to Home screen / Install app**. Then open the app once while online, sign in, and set a **phone code** under **Settings** (for example C1 or C2) so that bill numbers never clash.

## Worked example: a normal day with 3 phones

Setup: Owner Sara (phone **O1**), manager Kumar (phone **M1**), cashier Ravi (phone **C1**).

**7:00 am — Kumar records the morning stock (M1, online)**
*Add Stock* → Supplier `Venkateshwara Farms`, Product `Live Chicken`, Birds `40`, Weight `80`, Rate `110`, Paid now `5000`, Paid by Cash.
→ Amount ₹8,800. Live Chicken stock goes up by 80 kg. The screen shows "Balance due to supplier: ₹3,800".

**7:30 am — Kumar dresses 10 birds (M1)**
*Processing* → Birds `10`, Live weight `20`; outputs: With Skin `10`, Skinless `3`, Liver & Gizzard `1.2`.
→ Yield 71%, waste 5.8 kg. Live stock goes down 20 kg; the three output items go up.

**Kumar updates prices (M1)**
*Today's Rates* → With Skin `220`, then tap **Save rates**. Every phone shows the new price within seconds.

**10:15 am — the internet drops; Ravi keeps billing (C1, offline)**
*Sale* → tap **Chicken (With Skin)** → tap the `1.5 kg` chip → **Add**.
Tap **Chicken (Skinless)** → switch to **By amount (₹)** → `200` → **Add** (the app works out 0.769 kg).
Discount `10` → **UPI** → **Save bill**.
→ Bill `C1-261127-001`, ₹520. The header shows `● Offline · 1 to sync`. Ravi can print or share the bill straight away.

**10:40 am — the internet returns**
The header changes to `⟳ Syncing 1`, then `● Online`. The bill now appears in Sara's reports. Stock is reduced with *increments*, so sales made on two phones at once never overwrite each other.

**If two phones sold the last stock while offline**
Both bills are kept. The stock simply goes negative (for example −0.5 kg) and Home shows a red **Stock difference** alert. Kumar recounts and uses *Stock → Adjust → Actual count*. The adjustment is saved with his name and reason.

**9:00 pm — Kumar closes the day (M1)**
*Day Closing* → Opening cash `2000`, Cash counted `…` → the app shows expected cash and the difference → **Save closing**.
Sara checks *Reports → Today* or *This month* and uses **Sales CSV** to open the data in Excel.

## Good to know

- **The first sign-in on a phone needs internet.** After that, the app opens and bills offline. Sign-out is blocked while records are still waiting to sync, so no bill is lost.
- **Bill numbers** follow the format `PHONECODE-YYMMDD-serial`, so each phone counts its own bills without needing the server.
- **Backup:** each phone also keeps a local copy of its last 500 bills (*Settings → Download backup*).
- **Forgotten passwords:** the owner turns the old login **off** and creates a new one. There is no admin reset, which keeps the project on the free Spark plan.
- **Printing:** *Print* uses Android's print service. For a Bluetooth thermal printer, install a print-service app such as RawBT, then choose 58 mm or 80 mm paper in *Settings*. *Share / WhatsApp* sends the bill as text.
- **Estimated profit** is calculated as sales − purchases − expenses for the period, not as stock-valued cost.
- **Demo mode:** open `index.html` without a config and tap *Start demo mode* to try every role on one device with sample data.
- **Updating the app:** change `VER` in `index.html` and `CACHE` in `sw.js`, then upload the files again. Phones pick up the update the next time they open the app while online.

## Possible next steps
Bluetooth weighing-scale input, direct ESC/POS Bluetooth printing, credit-customer ledger with collections, supplier ledger, Tamil labels, and a GST invoice format (if the shop registers).
