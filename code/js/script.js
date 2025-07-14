// === ELEMENT TOGGLE ===
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

  setTimeout(() => {
    el.style.display = 'none';
    el.classList.remove('fade-close');
  }, 400);
}

// === ANIMACJA LINI ===
document.addEventListener("DOMContentLoaded", () => {
  const lines = document.querySelectorAll(".screen .line");
  lines.forEach((line, index) => {
    line.style.animationDelay = `${index * 0.1 + 0.3}s`;
  });
});

// === LAST.FM + DEVICES ===
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');

  fetch(`https://lastfm-last-played.biancarosa.com.br/hexa727/latest-song`)
    .then(res => res.json())
    .then(json => {
      const track = json.track;
      document.querySelector('#song').innerHTML =
        `<span class="song-title">${track.name}</span> <span class="song-dash">-</span> <span class="song-artist">${track.artist['#text']}</span>`;
    });

  fetch('/code/js/devices.json')
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
    .catch(err => console.error('Failed to load devices.json:', err));
});

// === HOVER EFFECT ===
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
    el.style.filter = `brightness(1.1) drop-shadow(0 0 10px ${shadowColor})`;
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

// === PARTICLES.JS CONFIG ===
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

// === TYPEWRITER & DISCORD STATUS + ACTIVITY ===
const userId = '1105531177886040114';
const staticDiscordStatusEl = document.getElementById('static-discord-status');
const activityEl = document.getElementById('discord-activity');

function fetchDiscordInfo() {
  fetch(`https://api.lanyard.rest/v1/users/${userId}`)
    .then(res => res.json())
    .then(data => {
      const status = data.data.discord_status || 'offline';
      let label = '', color = '';
      switch (status) {
        case 'online': label = 'online'; color = 'status-online'; break;
        case 'idle': label = 'idle'; color = 'status-idle'; break;
        case 'dnd': label = 'do not disturb'; color = 'status-dnd'; break;
        default: label = 'offline'; color = 'status-offline'; break;
      }

      if (staticDiscordStatusEl) {
        staticDiscordStatusEl.innerHTML = `<span class="status-dot ${color}"></span>${label}`;
      }

      const activities = data.data.activities;
      const nonCustom = activities.find(a => a.type !== 4); // skip custom statuses

    if (nonCustom && activityEl) {
        activityEl.textContent = nonCustom.name;
      }
    else if (activityEl) {
        activityEl.innerHTML = 'nothing';
      }
    })
    .catch(() => {
      if (staticDiscordStatusEl) {
        staticDiscordStatusEl.innerHTML = 'fetch error';
      }
      if (activityEl) {
        activityEl.innerHTML = 'fetch error';
      }
    });
}

fetchDiscordInfo();
setInterval(fetchDiscordInfo, 15000); // refresh every 15s

// === MOTYW + PARTICLES + ANIMACJA EMOTKI ===
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

// === AGE CALCULATION ===
function calculateAge(birthDateString, elementId) {
  const birthDate = new Date(birthDateString);
  const today = new Date();
  const ageInMilliseconds = today.getTime() - birthDate.getTime();
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  const ageElement = document.getElementById(elementId);
  if (ageElement) {
    ageElement.textContent = ageInYears.toFixed(1).toLocaleString('pl-PL');
  }
}
document.addEventListener("DOMContentLoaded", () => {
  calculateAge('2010-10', 'current-age');
});
