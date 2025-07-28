// === submenu toggle ===
function showElement(id) {
  const el = document.getElementById(id);
  el.style.display = 'block';
  el.style.opacity = '1';
  el.style.left = '50%';
  el.style.top = '50%';
  el.style.transform = 'translate(-50%, -50%) scale(1)';
  el.scrollTop = 0;

  const lines = el.querySelectorAll('.line');
  lines.forEach((line, i) => {
    line.style.animation = 'none';
    void line.offsetWidth;
    line.style.animation = `line-fade 0.4s ease forwards`;
    line.style.animationDelay = `${i * 0.06}s`;
  });
}

function hideElement(id) {
  const el = document.getElementById(id);
  el.classList.remove('fade-close');
  void el.offsetWidth;
  el.classList.add('fade-close');

let currentSubmenuId = null;

  setTimeout(() => {
    el.style.display = 'none';
    el.classList.remove('fade-close');
  }, 400);
}

// === line animation ===
document.addEventListener("DOMContentLoaded", () => {
  const lines = document.querySelectorAll(".screen .line");
  lines.forEach((line, index) => {
    line.style.animationDelay = `${index * 0.1 + 0.3}s`;
  });
});

// === last.fm integration ===
async function updateLastFM() {
  const username = "hexa727";
  const apiKey = "593fabf32092080ee2b6fad842570c30";
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const track = data.recenttracks.track[0];

    const isNowPlaying = track['@attr']?.nowplaying === "true";
    const artist = track.artist['#text'];
    const name = track.name.replace(/\s*[\(\[].*?[\)\]]/g, '').trim();
    const link = track.url;
    const image = track.image?.find(img => img.size === "extralarge")?.['#text'] || '';
    const uts = track.date?.uts;

    const songEl = document.getElementById("song");
    const statusEl = document.getElementById("status");
    const coverEl = document.getElementById("cover");
    const lastfmProfileUrl = "http://last.fm/user/hexa727";
    const artistUrl = `https://www.last.fm/music/${encodeURIComponent(artist.replace(/ /g, '+'))}`;
    
songEl.innerHTML = `
  <a href="${link}" target="_blank" class="song-link song-name">${name}</a>
  <br>
  <a href="${artistUrl}" target="_blank" class="song-link artist-name">${artist}</a>
`;


if (isNowPlaying) {
  statusEl.innerHTML = `<span class="shimmer">listening now</span> &bull; <a href="${lastfmProfileUrl}" target="_blank" rel="noopener noreferrer">last.fm</a>`;
} else if (uts) {
  const secondsAgo = Math.floor(Date.now() / 1000) - parseInt(uts);
  const minutes = Math.floor(secondsAgo / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let timeAgo = "";
  if (days > 0) timeAgo = `${days} day${days > 1 ? "s" : ""}`;
  else if (hours > 0) timeAgo = `${hours} hour${hours > 1 ? "s" : ""}`;
  else if (minutes > 0) timeAgo = `${minutes} minute${minutes > 1 ? "s" : ""}`;
  else timeAgo = `${secondsAgo} second${secondsAgo !== 1 ? "s" : ""}`;

  statusEl.innerHTML = `${timeAgo} ago &bull; <a href="${lastfmProfileUrl}" target="_blank" rel="noopener noreferrer">last.fm</a>`;
}

    if (image) {
      coverEl.src = image;
      coverEl.alt = `${name} cover`;
    } else {
      coverEl.src = "";
    }
  } catch (error) {
    console.error("failed to fetch last.fm data:", error);
    document.getElementById("song").textContent = "fetch error";
    document.getElementById("cover").src = "";
  }
}

updateLastFM();
setInterval(updateLastFM, 60 * 1000);

function formatSongLink() {
  const songLink = document.querySelector(".song-link");
  if (!songLink) return;

  if (window.innerWidth <= 600) {
    songLink.innerHTML = songLink.textContent.replace(/ *[–\-•] */g, "<br>");
  } else {
    songLink.innerHTML = songLink.textContent.replace(/\n/g, " - ");
  }
}
formatSongLink()

// === perspective hover ===
document.querySelectorAll('.perspective-hover').forEach(el => {
  let isPressed = false;
  let currentRotateX = 0;
  let currentRotateY = 0;

  const updateTransform = () => {
    const scale = isPressed ? 0.85 : 1.15;
    const theme = document.body.classList.contains('light') ? 'light' : 'dark';
    const shadowColor = theme === 'light' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.2)';
    el.style.transform = `perspective(600px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale(${scale})`;
    el.style.boxShadow = `${-currentRotateY}px ${currentRotateX}px 25px ${shadowColor}`;
    el.style.filter = `brightness(1.3) drop-shadow(0 0 10px ${shadowColor})`;
  };

  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    currentRotateX = ((y - centerY) / centerY) * 15;
    currentRotateY = ((x - centerX) / centerX) * -15;
    updateTransform();
  });

  el.addEventListener('mouseleave', () => {
    currentRotateX = 0;
    currentRotateY = 0;
    isPressed = false;
    el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
    el.style.boxShadow = 'none';
    el.style.filter = 'none';
  });

  el.addEventListener('mousedown', () => {
    isPressed = true;
    updateTransform();
  });

  el.addEventListener('mouseup', () => {
    isPressed = false;
    updateTransform();
  });
});

// === particles.js config ===
const baseParticlesConfig = {
  particles: {
    number: { value: 53, density: { enable: true, value_area: 800 }},
    color: { value: "#ffffff" },
    shape: {
      type: "circle",
      stroke: { width: 0, color: "#000000" },
      polygon: { nb_sides: 5 },
      image: { src: "img/github.svg", width: 100, height: 100 }
    },
    opacity: { value: 0.5, random: false },
    size: { value: 1, random: true },
    line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
    move: {
      enable: true, speed: 6, direction: "none",
      random: false, straight: false, out_mode: "out", bounce: false
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "grab" },
      onclick: { enable: false, mode: "repulse" },
      resize: true
    },
    modes: {
      grab: { distance: 400, line_linked: { opacity: 1 }},
      repulse: { distance: 200, duration: 0.4 }
    }
  },
  retina_detect: true
};

function loadParticles(theme = 'dark') {
  const config = JSON.parse(JSON.stringify(baseParticlesConfig));
  const isLight = theme === 'light';
  config.particles.color.value = isLight ? "#000000" : "#ffffff";
  config.particles.line_linked.color = isLight ? "#222222" : "#ffffff";
  particlesJS("particles-js", config);
}


// === light/dark theme ===
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');
let currentTheme = localStorage.getItem('theme');

if (!currentTheme) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  currentTheme = prefersDark ? 'dark' : 'light';
  localStorage.setItem('theme', currentTheme);
}

if (currentTheme === 'light') {
  document.body.classList.add('light');
  themeLabel.textContent = 'dark mode';
  themeIcon.textContent = '🌙';
} else {
  themeLabel.textContent = 'light mode';
  themeIcon.textContent = '☀️';
}

loadParticles(currentTheme);

themeToggle.addEventListener('click', () => {
  document.body.classList.add('theme-transition');
  themeIcon.classList.add('rotating');
  setTimeout(() => themeIcon.classList.remove('rotating'), 600);

  const isLight = document.body.classList.toggle('light');
  const newTheme = isLight ? 'light' : 'dark';

  themeLabel.classList.remove('glitch-text');
  void themeLabel.offsetWidth;
  themeLabel.classList.add('glitch-text');

  themeLabel.textContent = isLight ? 'dark mode' : 'light mode';
  themeIcon.textContent = isLight ? '🌙' : '☀️';

  localStorage.setItem('theme', newTheme);
  loadParticles(newTheme);

  setTimeout(() => {
    document.body.classList.remove('theme-transition');
  }, 500);
});

function startTitleGlitchLoop() {
  const title = document.querySelector('.main-title');
  setInterval(() => {
    title.classList.add('glitch-active');
    setTimeout(() => {
      title.classList.remove('glitch-active');
    }, 400);
  }, 4000 + Math.random() * 3000);
}

startTitleGlitchLoop();

// === devices.json rendering ===
  fetch('code/js/devices.json')
    .then(res => res.json())
    .then(data => {
      const brandsContainer = document.getElementById('brands-container');

      const createHeader = (title, container) => {
        const h3 = document.createElement('h3');
        h3.textContent = title;
        h3.classList.add('line');
        h3.style.marginTop = '1em';
        container.appendChild(h3);
        void h3.offsetWidth;
        h3.classList.add('visible');
      };

      const renderDevices = (items, container) => {
        const grouped = items.reduce((acc, device) => {
          const brand = device.name.split(' ')[0];
          (acc[brand] = acc[brand] || []).push(device);
          return acc;
        }, {});
      
        Object.entries(grouped).forEach(([brand, devices]) => {
          const section = document.createElement('div');
          section.className = 'brand-section';
      
          const headerContainer = document.createElement('div');
          headerContainer.className = 'brand-header-container';
      
          const brandButton = document.createElement('button');
          brandButton.setAttribute('type', 'button');
          brandButton.classList.add('brand-button', 'line');
          brandButton.innerHTML = `${brand} <span class="arrow">▼</span>`;
      
          headerContainer.appendChild(brandButton);
          section.appendChild(headerContainer);
      
          const list = document.createElement('ul');
          list.className = 'device-list';
          list.style.display = 'none';
      
          devices.forEach(({ name, note }) => {
            const li = document.createElement('li');
            li.textContent = note ? `${name} - ${note}` : name;
            list.appendChild(li);
          });
      
          section.appendChild(list);
          container.appendChild(section);
      
          const toggleVisibility = () => {
            const open = list.style.display === 'block';
            list.style.display = open ? 'none' : 'block';
            brandButton.classList.toggle('open', !open);
            brandButton.querySelector('.arrow').textContent = open ? '▼' : '▲';
      
            if (!open) {
              list.querySelectorAll('li').forEach((li, i) => {
                li.classList.add('line');
                void li.offsetWidth;
                li.classList.add('visible');
                li.style.animation = `line-fade 0.4s ease forwards`;
                li.style.animationDelay = `${i * 0.05}s`;
              });
            }
          };
      
          brandButton.addEventListener('click', toggleVisibility);
        });
      };

      createHeader('phones', brandsContainer);
      renderDevices(data.phones, brandsContainer);
      createHeader('tablets', brandsContainer);
      renderDevices(data.tablets, brandsContainer);
      createHeader('laptops', brandsContainer);
      renderDevices(data.laptops, brandsContainer);
      createHeader('consoles', brandsContainer);
      renderDevices(data.consoles, brandsContainer);
    })
    .catch(err => console.error('failed to load devices.json:', err));
