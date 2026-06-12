function initElevateSettings() {
  if (document.getElementById('settingsPanel')) return;

  const savedTheme = localStorage.getItem('elevate-theme') || 'light';
  const savedTextSize = localStorage.getItem('elevate-text-size') || 'normal';
  document.documentElement.dataset.theme = savedTheme;
  document.documentElement.dataset.textSize = savedTextSize;

  const overlay = document.createElement('div');
  overlay.className = 'settings-overlay';
  overlay.id = 'settingsOverlay';
  overlay.onclick = closeSettings;

  const panel = document.createElement('aside');
  panel.className = 'settings-panel';
  panel.id = 'settingsPanel';
  panel.setAttribute('aria-label', 'Settings');
  panel.innerHTML = `
    <div class="settings-top">
      <div>
        <h2>Settings</h2>
        <p>Personalize Elevate for your learning, safety, and comfort.</p>
      </div>
      <button class="settings-close" type="button" aria-label="Close settings" onclick="closeSettings()">×</button>
    </div>

    <div class="settings-card">
      <h3>Account</h3>
      <div class="settings-row">
        <div>
          <span>My profile</span>
          <small>Progress, mentors, saved classes</small>
        </div>
        <a class="settings-link" href="profile.html">Open</a>
      </div>
      <div class="settings-row">
        <div>
          <span>Premium plan</span>
          <small>Certificates, mentor priority, offline resources</small>
        </div>
        <a class="settings-link" href="profile.html#premium">View</a>
      </div>
    </div>

    <div class="settings-card">
      <h3>Appearance</h3>
      <div class="settings-row">
        <div>
          <span>Theme</span>
          <small>Choose light or dark mode</small>
        </div>
        <div class="theme-switch" role="group" aria-label="Theme">
          <button class="theme-option" type="button" data-theme-choice="light">Light</button>
          <button class="theme-option" type="button" data-theme-choice="dark">Dark</button>
        </div>
      </div>
      <div class="settings-row">
        <div>
          <span>Text size</span>
          <small>Improve readability</small>
        </div>
        <select class="text-size-select" id="textSizeSelect" aria-label="Text size">
          <option value="normal">Normal</option>
          <option value="large">Large</option>
        </select>
      </div>
    </div>

    <div class="settings-card">
      <h3>Safety</h3>
      <div class="settings-row">
        <div>
          <span>Privacy mode</span>
          <small>Reduce public profile details</small>
        </div>
        <label class="setting-toggle">
          <input type="checkbox" id="privacyModeToggle">
          <span></span>
        </label>
      </div>
      <div class="settings-row">
        <div>
          <span>Emergency support</span>
          <small>Police 100, Women 1145, Mental Health 1166</small>
        </div>
        <a class="settings-link" href="page.html#helplines">Open</a>
      </div>
    </div>

    <div class="settings-card">
      <h3>More</h3>
      <div class="settings-row">
        <div>
          <span>Classes</span>
          <small>Rights, leadership, digital safety</small>
        </div>
        <a class="settings-link" href="classes.html">Learn</a>
      </div>
      <div class="settings-row">
        <div>
          <span>Share your story</span>
          <small>Help the community learn from real voices</small>
        </div>
        <a class="settings-link" href="article.html">Write</a>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  const privacyToggle = document.getElementById('privacyModeToggle');
  privacyToggle.checked = localStorage.getItem('elevate-privacy-mode') === 'true';
  privacyToggle.addEventListener('change', () => {
    localStorage.setItem('elevate-privacy-mode', String(privacyToggle.checked));
  });

  const textSelect = document.getElementById('textSizeSelect');
  textSelect.value = savedTextSize;
  textSelect.addEventListener('change', () => {
    document.documentElement.dataset.textSize = textSelect.value;
    localStorage.setItem('elevate-text-size', textSelect.value);
  });

  document.querySelectorAll('[data-theme-choice]').forEach(button => {
    button.classList.toggle('active', button.dataset.themeChoice === savedTheme);
    button.addEventListener('click', () => {
      const theme = button.dataset.themeChoice;
      document.documentElement.dataset.theme = theme;
      localStorage.setItem('elevate-theme', theme);
      document.querySelectorAll('[data-theme-choice]').forEach(item => {
        item.classList.toggle('active', item.dataset.themeChoice === theme);
      });
    });
  });
}

function openSettings() {
  initElevateSettings();
  document.getElementById('settingsOverlay').classList.add('open');
  document.getElementById('settingsPanel').classList.add('open');
}

function closeSettings() {
  document.getElementById('settingsOverlay')?.classList.remove('open');
  document.getElementById('settingsPanel')?.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', initElevateSettings);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeSettings();
});
