const ELEVATE_STORY_KEY = 'elevate-stories';
const ELEVATE_PROFILE_PHOTO_KEY = 'elevate-profile-photo';
const ELEVATE_PROFILE_NAME_KEY = 'elevate-profile-name';
const ELEVATE_PROFILE_BIO_KEY = 'elevate-profile-bio';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Ignore storage failures in file:// or restricted environments.
  }
}

function readValue(key, fallback = '') {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function writeValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // Ignore storage failures in file:// or restricted environments.
  }
}

function getElevateStories() {
  return readJson(ELEVATE_STORY_KEY, []);
}

function saveElevateStory(story) {
  const stories = getElevateStories();
  stories.unshift(story);
  writeJson(ELEVATE_STORY_KEY, stories.slice(0, 24));
}

function getElevateProfileName() {
  return readValue(ELEVATE_PROFILE_NAME_KEY, 'Anita Shrestha');
}

function setElevateProfileName(name) {
  writeValue(ELEVATE_PROFILE_NAME_KEY, name);
}

function getElevateProfileBio() {
  return readValue(ELEVATE_PROFILE_BIO_KEY, 'Learning, speaking, and building a safer community for everyone.');
}

function setElevateProfileBio(bio) {
  writeValue(ELEVATE_PROFILE_BIO_KEY, bio);
}

function getElevateProfilePhoto() {
  return readValue(ELEVATE_PROFILE_PHOTO_KEY, '');
}

function setElevateProfilePhoto(dataUrl) {
  writeValue(ELEVATE_PROFILE_PHOTO_KEY, dataUrl);
}

function formatElevateDate(value) {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderElevateStories(container, stories, options = {}) {
  if (!container) return;

  const emptyLabel = options.emptyLabel || 'No stories yet. Share your first story to pin it here.';
  if (!stories.length) {
    container.innerHTML = `<div class="empty-feed">${emptyLabel}</div>`;
    return;
  }

  container.innerHTML = stories.map((story) => {
    const preview = (story.content || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
    return `
      <article class="profile-story-card">
        <div class="story-top">
          <div>
            <h3>${story.title || 'Untitled story'}</h3>
            <p>${formatElevateDate(story.createdAt)}</p>
          </div>
          <span class="story-tag ${story.tag || 'story'}">${story.tagLabel || 'Story'}</span>
        </div>
        <div class="story-meta">
          <span>${story.author || 'Anonymous'}</span>
          <span>${story.source === 'article' ? 'Shared from Articles' : 'Profile post'}</span>
        </div>
        <div class="story-body">${preview}</div>
      </article>
    `;
  }).join('');
}

function bindElevateProfilePhoto(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!input || !preview) return;

  const storedPhoto = getElevateProfilePhoto();
  if (storedPhoto) preview.src = storedPhoto;

  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      preview.src = dataUrl;
      setElevateProfilePhoto(dataUrl);
    };
    reader.readAsDataURL(file);
  });
}

function initElevateProfilePage(config = {}) {
  const nameInput = config.nameInputId ? document.getElementById(config.nameInputId) : null;
  const bioInput = config.bioInputId ? document.getElementById(config.bioInputId) : null;
  const feed = config.feedId ? document.getElementById(config.feedId) : null;
  const count = config.countId ? document.getElementById(config.countId) : null;

  if (nameInput) {
    nameInput.value = getElevateProfileName();
    nameInput.addEventListener('input', () => {
      const value = nameInput.value.trim() || 'Anita Shrestha';
      setElevateProfileName(value);
    });
  }

  if (bioInput) {
    bioInput.value = getElevateProfileBio();
    bioInput.addEventListener('input', () => {
      const value = bioInput.value.trim() || 'Learning, speaking, and building a safer community for everyone.';
      setElevateProfileBio(value);
    });
  }

  if (config.photoInputId && config.photoPreviewId) {
    bindElevateProfilePhoto(config.photoInputId, config.photoPreviewId);
  }

  const render = () => {
    const stories = getElevateStories();
    renderElevateStories(feed, stories, { emptyLabel: 'No stories yet. Share one from Articles and it will appear here.' });
    if (count) {
      count.textContent = `${stories.length} shared ${stories.length === 1 ? 'story' : 'stories'}`;
    }
  };

  render();
  window.addEventListener('storage', render);
}
