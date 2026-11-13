import React from 'react';
import Head from '@docusaurus/Head';
import '../css/privacy.css';
import SiteNav from '../components/site-nav/SiteNav';
import SiteFooter from '../components/site-footer/SiteFooter';

export default function Privacy() {
  return (
    <div className="site-page">
      <Head>
        <title>Privacy Policy — Pocket Nutrition</title>
        <meta
          name="description"
          content="Privacy policy for the Pocket Nutrition app. No ads, no trackers: your food journal never leaves your device. Voice capture and the cloud vault are optional and described here."
        />
        <link rel="canonical" href="https://pocketnutrition.org/privacy" />
        <meta name="robots" content="index,follow" />
      </Head>

      <SiteNav />

      <div className="pn-privacy site-page-main">
        <main className="wrap">
          <h1>Privacy Policy</h1>
          <p className="meta">Pocket Nutrition mobile apps (iOS and Android) · Last updated: November 1, 2026</p>

          <div className="callout">
            <p><strong>In short: your food journal stays on your phone, unless you create a cloud vault
            account.</strong> There are no ads, no trackers, no analytics, and no third-party
            data-collection SDKs. Searching foods needs no account. The <strong>cloud vault is
            optional</strong> (a username, no email): it keeps an encrypted copy of your journal that we
            cannot read, and it is required for voice capture, which sends a recording off your phone.
            Both are described in their own section below.</p>
          </div>

          <h2>What Stays on Your Device</h2>

          <p>Your logged meals — ingredients, quantities, cooking methods, and timestamps — are stored
          locally in the app's private directory on your phone:</p>

          <ul>
            <li><strong>iOS:</strong> stored in the app's <em>Application Support</em> folder.</li>
            <li><strong>Android:</strong> stored in <code>filesDir</code>, the app's private storage, and{' '}
              <strong>explicitly excluded from Android Auto Backup</strong>, so it is never copied to
              Google Drive or transferred to a new device.</li>
          </ul>

          <p>Without a vault account, this file is never transmitted. Uninstalling the app permanently
          deletes it, and no copy exists anywhere else: because we don't hold one, we cannot access or
          restore your data. With a vault account on iOS, an encrypted copy is also kept in your vault
          (see below); the file on your phone remains the working copy.</p>

          <h2>What Is Sent to Our Server</h2>

          <p>By default the app contacts exactly one address, <code>api.pocketnutrition.org</code>, and
          only when you actively perform an action. Two more addresses are contacted only if you use voice
          capture: <code>recognition.pocketnutrition.org</code> and <code>vault.pocketnutrition.org</code>,
          described in the next section.</p>

          <table>
            <thead>
              <tr><th>When</th><th>What is sent</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Searching for food</td>
                <td>The text typed in the search field. Nothing else.</td>
              </tr>
              <tr>
                <td>Scanning a barcode</td>
                <td>The barcode number. The camera image never leaves your device.</td>
              </tr>
              <tr>
                <td>Analyzing a meal</td>
                <td>For each ingredient: its name, quantity, unit, cooking method, and whether it was
                  weighed raw or cooked.</td>
              </tr>
            </tbody>
          </table>

          <p>Requests contain zero identifiers: no device ID, advertising ID, account token, or cookies.
          Two requests from the same person are completely indistinguishable, to our server, from
          requests sent by two different people.</p>

          <h3>Server Logs</h3>

          <p>Like most web servers, ours logs incoming HTTP requests, which include the originating IP
          address and the request payload — so the search term or the list of ingredients analyzed. We
          state this explicitly because IP logs are the only theoretical, indirect link between a
          request and a connection anywhere in this document. These logs are used strictly for
          technical diagnostics, are never cross-referenced with anything else, and are shared with no
          one.</p>

          <h2>Voice Capture and the Cloud Vault (Optional)</h2>

          <p>The cloud vault is off until you create an account, and you can stop using it at any time.
          On iOS, once an account is linked, your whole meal journal is saved to it (see &ldquo;The
          vault account&rdquo;). Voice capture, which lets you describe a meal out loud, requires the
          account.</p>

          <h3>The recording</h3>

          <p>When you record, the audio is sent to <code>recognition.pocketnutrition.org</code> to be turned
          into text and then into a list of foods. The recognition service is open source and
          self-hosted: it runs on servers operated by members of the community, with speech and language
          models that run on those machines, and the recording is not handed to a third-party AI
          service. Whoever operates the server you use can hear the recording while it is processed;
          you can point the app at a server you run yourself (Settings, advanced). The service keeps the
          recording in memory only until it is processed, at most 48 hours, and never writes it to disk.
          The app also keeps the recording on your phone until the result has arrived, so it can be sent
          again if needed, and for at most 7 days.</p>

          <p>The request carries a short-lived, write-only token issued by your vault, and the address of
          your vault. It does not carry your name, your passphrase or any other identifier.</p>

          <h3>The result</h3>

          <p>The result (what you said and the foods recognised) is delivered to your vault, encrypted
          with a key that only your devices hold. The recognition service does not keep it once it has been
          delivered.</p>

          <h3>The vault account</h3>

          <p><code>vault.pocketnutrition.org</code> stores, for your account: the username you chose (3 to
          64 characters, no email address is requested or stored), a digest of a login value derived from
          your passphrase, the key-derivation settings, your keys in wrapped (encrypted) form, the label
          of each linked device (for example &ldquo;iPhone&rdquo;), the hash of each device&rsquo;s access
          key, timestamps, and your records in encrypted form. Your records are your voice results and, once
          you link an account, <strong>every meal of your journal</strong> (foods, quantities, cooking
          methods and times). Linking an account uploads the meals already on your phone; edits and
          deletions are synchronised afterwards. The server also sees the number, size and type of your
          records and when they were written, but not their content. <strong>Your passphrase never leaves your
          phone</strong>, and neither does any key able to read your records. We therefore cannot read what
          is in your vault, and we cannot recover it for you: if you lose both your passphrase and your
          recovery key, the content is gone for good.</p>

          <p>Like the nutrition server, the vault and recognition servers log incoming requests with the
          originating IP address, for technical diagnostics only.</p>

          <h3>The web viewer</h3>

          <p><code>me.pocketnutrition.org</code> is an optional, read-only page to look at your journal from
          a browser. It is a static page: it contains no server logic and receives nothing from you. When you
          log in, it contacts only <code>vault.pocketnutrition.org</code> (like the app does), derives your
          keys and decrypts your records inside your browser, and keeps nothing: no cookie, no local storage,
          no account of its own. Your passphrase never leaves the page. The session ends when you log out,
          close the tab, or stay idle for 10 minutes, and the browser appears in your vault as a linked
          device labelled &ldquo;Web browser&rdquo; until it logs out.</p>

          <h3>Erasing it</h3>

          <p>The vault screen in the app has a &ldquo;Delete account&rdquo; action. It permanently removes
          the account and everything stored for it on the vault server.</p>

          <h2>What We Do Not Do</h2>

          <ul>
            <li><strong>No tracking or analytics:</strong> no crash reporting or analytics SDKs are
              embedded in the apps, verifiable directly in our source code. iOS uses a single external
              library, libsodium (through swift-sodium), for the vault&rsquo;s cryptography; it makes no
              network requests and collects nothing. Android uses only standard UI and data-parsing
              libraries, none of which transmit anything.</li>
            <li><strong>No ad tracking:</strong> we do not request Apple's App Tracking Transparency
              permission, because we don't track users.</li>
            <li><strong>No data selling:</strong> no passwords or emails are collected, and no data is sold,
              rented, or shared. The only account is the optional vault account described above.</li>
            <li><strong>Minimal permissions:</strong> the camera is used only to scan a barcode, and the
              microphone only while you are recording a meal. The app never asks for your photos,
              contacts, location, or health data. On Android, the requested permissions are{' '}
              <code>INTERNET</code>, <code>CAMERA</code> and <code>RECORD_AUDIO</code>.</li>
          </ul>

          <h2>Children &amp; Your Rights (GDPR)</h2>

          <p>The app does not target children specifically. Under the GDPR, you have the right to access,
          correct, erase, and object to the processing of your data. In practice here: your journal data is
          entirely in your hands, on your device, and we hold no copy of it — deleting an entry, or
          uninstalling the app, erases it. If you use voice capture, the personal data we hold is your
          vault username and what is listed in the vault section above. You can erase all of it with
          &ldquo;Delete account&rdquo; in the app. The content of your vault is encrypted with keys we
          never receive, so we cannot read it or export it in readable form for you; your own devices
          can.</p>

          <p>For any question about this document, write to the address listed on the{' '}
          <a href="/">homepage</a>.</p>

          <h2>Data Sources &amp; Licensing</h2>

          <p>Nutritional values are sourced from public databases, primarily{' '}
          <a href="https://ciqual.anses.fr" rel="noopener">Ciqual</a> (ANSES) and{' '}
          <a href="https://world.openfoodfacts.org" rel="noopener">Open Food Facts</a>, the latter under
          the Open Database License. The mobile apps themselves are open source under the{' '}
          <a href="https://www.mozilla.org/MPL/2.0/" rel="noopener">MPL-2.0</a> license, and their
          complete source code is public:{' '}
          <a href="https://github.com/pocket-nutrition/ios" rel="noopener">iOS</a> ·{' '}
          <a href="https://github.com/pocket-nutrition/android" rel="noopener">Android</a>.</p>

          <h2>Changes to This Policy</h2>

          <p>If this policy is updated, the date at the top will be updated accordingly. Every revision
          is tracked and publicly visible in our repository's Git commit history, which makes any
          change verifiable rather than just declared.</p>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
