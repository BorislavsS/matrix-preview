const heroVideo = document.querySelector(".hero-video video");
const soundButton = document.querySelector(".sound-button");
const canvas = document.querySelector(".audio-reactor");
const ctx = canvas?.getContext("2d");
const languageToggle = document.querySelector(".language-toggle");

const translations = {
  en: {
    meta: {
      title: "RADO GOST | Contemporary Folk From Novgorod",
      description: "Official website of RADO GOST, a contemporary folk ensemble from Novgorod. Watch the live performance, listen on streaming platforms and book the band.",
    },
    brand: {
      name: "RADO GOST",
      rado: "RADO",
      gost: "GOST",
      homeLabel: "RADO GOST home",
    },
    nav: {
      label: "Main navigation",
      video: "Video",
      music: "Music",
      book: "Book",
    },
    rail: {
      label: "Site sections",
      video: "Video",
      dates: "Dates",
      music: "Music",
      contact: "Contact",
    },
    language: {
      toggleLabel: "Switch language to Russian",
    },
    video: {
      label: "RADO GOST live video",
      unsupported: "Your browser does not support video.",
    },
    posters: {
      label: "RADO GOST concerts and posters",
      kicker: "Live dates",
      title: "Concerts and events",
      upcomingKicker: "Upcoming",
      upcomingTitle: "New dates are coming",
      upcomingText: "Tour cities, venues and official posters will appear here as soon as they are announced.",
      bookingKicker: "Booking",
      bookingTitle: "Invite RADO GOST",
      bookingText: "Concerts, festivals, private gatherings and cultural programs with a strong live presence.",
    },
    links: {
      label: "RADO GOST music and social links",
      kicker: "Listen anywhere",
      title: "Carry the sound further",
      yandex: "Yandex Music",
      youtube: "YouTube Music",
    },
    contacts: {
      label: "RADO GOST contacts",
      kicker: "Contact",
      title: "Booking and press",
    },
    sound: {
      enableLabel: "Enable site audio",
      disableLabel: "Disable site audio",
      title: "Enable sound",
      subtitle: "Play music",
      enabledTitle: "Mute sound",
      enabledSubtitle: "Audio is on",
    },
  },
  ru: {
    meta: {
      title: "РАДО ГОСТ | Современный фолк из Новгорода",
      description: "Официальный сайт группы РАДО ГОСТ, современного фолк-ансамбля из Новгорода. Смотрите живое выступление, слушайте музыку и приглашайте группу.",
    },
    brand: {
      name: "РАДО ГОСТ",
      rado: "РАДО",
      gost: "ГОСТ",
      homeLabel: "РАДО ГОСТ, на главную",
    },
    nav: {
      label: "Главная навигация",
      video: "Видео",
      music: "Музыка",
      book: "Пригласить",
    },
    rail: {
      label: "Разделы сайта",
      video: "Видео",
      dates: "Афиша",
      music: "Музыка",
      contact: "Контакты",
    },
    language: {
      toggleLabel: "Переключить язык на английский",
    },
    video: {
      label: "Живое видео РАДО ГОСТ",
      unsupported: "Ваш браузер не поддерживает видео.",
    },
    posters: {
      label: "Концерты и афиши РАДО ГОСТ",
      kicker: "Живые даты",
      title: "Концерты и события",
      upcomingKicker: "Скоро",
      upcomingTitle: "Новые даты готовятся",
      upcomingText: "Города тура, площадки и официальные афиши появятся здесь сразу после анонса.",
      bookingKicker: "Букинг",
      bookingTitle: "Пригласить РАДО ГОСТ",
      bookingText: "Концерты, фестивали, частные события и культурные программы с сильным живым звучанием.",
    },
    links: {
      label: "Музыка и социальные ссылки РАДО ГОСТ",
      kicker: "Слушать везде",
      title: "Пусть звук идет дальше",
      yandex: "Яндекс Музыка",
      youtube: "YouTube Music",
    },
    contacts: {
      label: "Контакты РАДО ГОСТ",
      kicker: "Контакты",
      title: "Букинг и пресса",
    },
    sound: {
      enableLabel: "Включить звук сайта",
      disableLabel: "Выключить звук сайта",
      title: "Включить звук",
      subtitle: "Запустить музыку",
      enabledTitle: "Выключить звук",
      enabledSubtitle: "Звук включен",
    },
  },
};

let audioContext;
let analyser;
let streamNode;
let frequencyData;
let timeData;
let idlePhase = 0;
let currentLanguage = "en";
let soundEnabled = false;
let starfield = [];
let distantStars = [];
let cosmicDust = [];
let nebulas = [];
let lastFrameTime = 0;
const targetFrameMs = 50;

const buildStarfield = () => {
  const width = document.documentElement.clientWidth || window.innerWidth;
  const height = document.documentElement.clientHeight || window.innerHeight;
  const count = Math.min(320, Math.max(110, Math.floor((width * height) / 5400)));
  const distantCount = Math.min(460, Math.max(170, Math.floor((width * height) / 3800)));
  const dustCount = Math.min(34, Math.max(14, Math.floor((width * height) / 56000)));

  starfield = Array.from({ length: count }, () => {
    const bright = Math.random() > 0.975;
    const depth = 0.35 + Math.random() * 1.65;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      depth,
      size: bright ? 0.72 + Math.random() * 0.9 : 0.18 + Math.random() * 0.58,
      alpha: bright ? 0.46 + Math.random() * 0.3 : 0.06 + Math.random() * 0.32,
      speed: 0.18 + Math.random() * 0.82,
      phase: Math.random() * Math.PI * 2,
      tint: Math.random(),
      bright,
    };
  });

  distantStars = Array.from({ length: distantCount }, () => {
    const bright = Math.random() > 0.975;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: bright ? 0.62 + Math.random() * 1.05 : 0.16 + Math.random() * 0.5,
      alpha: bright ? 0.34 + Math.random() * 0.32 : 0.045 + Math.random() * 0.2,
      drift: 0.04 + Math.random() * 0.22,
      phase: Math.random() * Math.PI * 2,
      tint: Math.random(),
      bright,
    };
  });

  cosmicDust = Array.from({ length: dustCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.max(width, height) * (0.035 + Math.random() * 0.12),
    alpha: 0.006 + Math.random() * 0.028,
    drift: 0.08 + Math.random() * 0.34,
    phase: Math.random() * Math.PI * 2,
    color: Math.random() < 0.46 ? [111, 148, 108] : Math.random() < 0.72 ? [139, 184, 216] : [226, 155, 67],
  }));

  nebulas = [
    {
      x: width * 0.16,
      y: height * 0.2,
      radius: Math.max(width, height) * 0.52,
      color: [139, 184, 216],
      alpha: 0.082,
      dx: 2.2,
      dy: 1.2,
      phase: 0.4,
    },
    {
      x: width * 0.78,
      y: height * 0.56,
      radius: Math.max(width, height) * 0.58,
      color: [111, 148, 108],
      alpha: 0.068,
      dx: -1.4,
      dy: 1.8,
      phase: 1.8,
    },
    {
      x: width * 0.52,
      y: height * 0.88,
      radius: Math.max(width, height) * 0.5,
      color: [226, 155, 67],
      alpha: 0.064,
      dx: 1.5,
      dy: -1.1,
      phase: 3.2,
    },
  ];
};

const drawNebulas = (width, height, bass, mid) => {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (const nebula of nebulas) {
    const x = nebula.x + Math.sin(idlePhase * 0.09 + nebula.phase) * nebula.dx * 18;
    const y = nebula.y + Math.cos(idlePhase * 0.08 + nebula.phase) * nebula.dy * 18;
    const radius = nebula.radius * (0.92 + Math.sin(idlePhase * 0.05 + nebula.phase) * 0.06);
    const alpha = nebula.alpha + bass * 0.035 + mid * 0.02;
    const [r, g, b] = nebula.color;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
    gradient.addColorStop(0.42, `rgba(${r}, ${g}, ${b}, ${alpha * 0.42})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  for (const dust of cosmicDust) {
    const x = (dust.x - idlePhase * 4.8 * dust.drift + width) % width;
    const y = dust.y + Math.sin(idlePhase * 0.12 + dust.phase) * 16 * dust.drift;
    const [r, g, b] = dust.color;
    const alpha = dust.alpha + bass * 0.006 + mid * 0.006;
    const cloud = ctx.createRadialGradient(x, y, 0, x, y, dust.radius);

    cloud.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
    cloud.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.35})`);
    cloud.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    ctx.fillStyle = cloud;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();
};

const drawDistantStars = (width, height, mid) => {
  if (!distantStars.length) {
    buildStarfield();
  }

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (const star of distantStars) {
    const x = (star.x - idlePhase * 10 * star.drift + width) % width;
    const y = (star.y + Math.sin(idlePhase * 0.18 + star.phase) * 4 * star.drift + height) % height;
    const shimmer = Math.sin(idlePhase * (0.4 + star.drift) + star.phase) * 0.04;
    const alpha = Math.max(0.04, Math.min(0.78, star.alpha + shimmer + mid * 0.035));
    const color = star.tint < 0.12 ? "158, 197, 224" : star.tint > 0.9 ? "255, 205, 135" : "245, 239, 227";

    ctx.fillStyle = `rgba(${color}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};

const drawStarfield = (width, height, bass, mid) => {
  if (!starfield.length) {
    buildStarfield();
  }

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (const star of starfield) {
    const x = (star.x - idlePhase * 22 * star.speed * star.depth + width) % width;
    const y = (star.y + Math.sin(idlePhase * 0.18 + star.phase) * 9 * star.depth + height) % height;
    const shimmer = Math.sin(idlePhase * (0.75 + star.speed * 0.28) + star.phase) * 0.055;
    const alpha = Math.max(0.035, Math.min(0.78, star.alpha + shimmer + mid * 0.045));
    const color = star.tint < 0.16 ? "139, 184, 216" : star.tint > 0.88 ? "255, 195, 111" : "245, 239, 227";

    ctx.fillStyle = `rgba(${color}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, star.size, 0, Math.PI * 2);
    ctx.fill();

    if (star.bright) {
      ctx.strokeStyle = `rgba(${color}, ${alpha * 0.26})`;
      ctx.lineWidth = 0.55;
      ctx.beginPath();
      ctx.moveTo(x - star.size * 2.6, y);
      ctx.lineTo(x + star.size * 2.6, y);
      ctx.moveTo(x, y - star.size * 2.6);
      ctx.lineTo(x, y + star.size * 2.6);
      ctx.stroke();
    }
  }
  ctx.restore();
};

const getStoredLanguage = () => {
  try {
    return localStorage.getItem("radogost-language");
  } catch {
    return null;
  }
};

const storeLanguage = (language) => {
  try {
    localStorage.setItem("radogost-language", language);
  } catch {
    return;
  }
};

const getTranslation = (language, key) => {
  return key.split(".").reduce((value, part) => value?.[part], translations[language]) || "";
};

const applyLanguage = (language) => {
  const safeLanguage = translations[language] ? language : "en";
  currentLanguage = safeLanguage;
  document.documentElement.lang = safeLanguage;
  document.title = getTranslation(safeLanguage, "meta.title");

  const description = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');

  if (description) {
    description.setAttribute("content", getTranslation(safeLanguage, "meta.description"));
  }

  if (ogTitle) {
    ogTitle.setAttribute("content", getTranslation(safeLanguage, "meta.title"));
  }

  if (ogDescription) {
    ogDescription.setAttribute("content", getTranslation(safeLanguage, "meta.description"));
  }

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = getTranslation(safeLanguage, element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    element.dataset.i18nAttr.split(",").forEach((entry) => {
      const [attribute, key] = entry.split(":").map((part) => part.trim());
      if (attribute && key) {
        element.setAttribute(attribute, getTranslation(safeLanguage, key));
      }
    });
  });

  if (languageToggle) {
    languageToggle.dataset.language = safeLanguage;
    languageToggle.setAttribute("aria-pressed", safeLanguage === "ru" ? "true" : "false");
  }

  updateSoundButton();
  storeLanguage(safeLanguage);
};

const updateSoundButton = () => {
  if (!soundButton) {
    return;
  }

  const title = soundButton.querySelector("[data-i18n='sound.title']");
  const subtitle = soundButton.querySelector("[data-i18n='sound.subtitle']");

  soundButton.dataset.soundState = soundEnabled ? "on" : "off";
  soundButton.setAttribute("aria-pressed", soundEnabled ? "true" : "false");
  soundButton.setAttribute("aria-label", getTranslation(currentLanguage, soundEnabled ? "sound.disableLabel" : "sound.enableLabel"));

  if (title) {
    title.textContent = getTranslation(currentLanguage, soundEnabled ? "sound.enabledTitle" : "sound.title");
  }

  if (subtitle) {
    subtitle.textContent = getTranslation(currentLanguage, soundEnabled ? "sound.enabledSubtitle" : "sound.subtitle");
  }
};

const resizeCanvas = () => {
  if (!canvas || !ctx) {
    return;
  }

  const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
  const width = document.documentElement.clientWidth || window.innerWidth;
  const height = document.documentElement.clientHeight || window.innerHeight;

  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  buildStarfield();
};

const average = (data, from, to) => {
  if (!data || !data.length) {
    return 0;
  }

  const start = Math.max(0, Math.floor(from));
  const end = Math.min(data.length, Math.floor(to));
  let sum = 0;

  for (let i = start; i < end; i += 1) {
    sum += data[i];
  }

  return end > start ? sum / ((end - start) * 255) : 0;
};

const drawVisualizer = (timestamp = 0) => {
  if (!canvas || !ctx) {
    return;
  }

  if (document.hidden || timestamp - lastFrameTime < targetFrameMs) {
    requestAnimationFrame(drawVisualizer);
    return;
  }

  lastFrameTime = timestamp;

  const width = document.documentElement.clientWidth || window.innerWidth;
  const height = document.documentElement.clientHeight || window.innerHeight;

  let bass = 0.08 + Math.sin(idlePhase) * 0.035;
  let mid = 0.08 + Math.sin(idlePhase * 0.7 + 1.2) * 0.03;

  if (analyser && frequencyData && timeData) {
    analyser.getByteFrequencyData(frequencyData);
    analyser.getByteTimeDomainData(timeData);
    bass = average(frequencyData, 2, 18);
    mid = average(frequencyData, 18, 72);
  }

  idlePhase += 0.026 + bass * 0.048;
  ctx.clearRect(0, 0, width, height);

  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, `rgba(0, 0, 0, ${0.82 - bass * 0.08})`);
  bg.addColorStop(0.46, `rgba(5, 8, 13, ${0.7 + mid * 0.06})`);
  bg.addColorStop(1, "rgba(0, 0, 0, 0.94)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  drawNebulas(width, height, bass, mid);
  drawDistantStars(width, height, mid);
  drawStarfield(width, height, bass, mid);

  if (analyser && timeData && soundEnabled) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.beginPath();

    const waveWidth = Math.min(width * 0.58, 780);
    const waveLeft = width * 0.5 - waveWidth / 2;
    const waveY = height * 0.78;

    for (let i = 0; i < timeData.length; i += 1) {
      const x = waveLeft + (i / (timeData.length - 1)) * waveWidth;
      const amp = (timeData[i] - 128) / 128;
      const y = waveY + amp * (12 + bass * 34);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.strokeStyle = `rgba(139, 184, 216, ${0.08 + mid * 0.18})`;
    ctx.lineWidth = 0.8 + mid * 1.2;
    ctx.stroke();
    ctx.restore();
  }

  requestAnimationFrame(drawVisualizer);
};

const setupAudioVisualizer = async () => {
  if (!heroVideo || !canvas || !ctx) {
    return;
  }

  if (!audioContext) {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextConstructor();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.82;
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    timeData = new Uint8Array(analyser.fftSize);

    const stream = heroVideo.captureStream?.() || heroVideo.mozCaptureStream?.();
    if (stream) {
      streamNode = audioContext.createMediaStreamSource(stream);
      streamNode.connect(analyser);
    }
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }
};

const seekToStart = () => {
  if (!heroVideo) {
    return;
  }

  const startAt = Number(heroVideo.dataset.start || 0);
  if (heroVideo && Number.isFinite(startAt) && Math.abs(heroVideo.currentTime - startAt) > 0.25) {
    try {
      heroVideo.currentTime = startAt;
    } catch {
      return;
    }
  }
};

if (canvas && ctx) {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  requestAnimationFrame(drawVisualizer);
}

if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    applyLanguage(currentLanguage === "en" ? "ru" : "en");
  });
}

applyLanguage(getStoredLanguage() || "en");

if (heroVideo) {
  heroVideo.addEventListener("loadedmetadata", seekToStart, { once: true });

  heroVideo.addEventListener("ended", () => {
    seekToStart();
    heroVideo.play().catch(() => {});
  });

  heroVideo.muted = true;
  heroVideo.volume = 1;
  heroVideo.play().catch(() => {
    heroVideo.muted = true;
    if (soundButton) {
      soundButton.hidden = false;
    }
  });
}

if (heroVideo && soundButton) {
  soundButton.addEventListener("click", async () => {
    let canPlay = false;

    if (soundEnabled) {
      heroVideo.defaultMuted = true;
      heroVideo.muted = true;
      heroVideo.setAttribute("muted", "");
      soundEnabled = false;
      updateSoundButton();
      return;
    }

    try {
      heroVideo.defaultMuted = false;
      heroVideo.muted = false;
      heroVideo.removeAttribute("muted");
      heroVideo.volume = 1;
    } catch {
      // Keep going: playback is more important than the visualizer.
    }

    try {
      await heroVideo.play();
      await setupAudioVisualizer().catch(() => {});
      canPlay = true;
    } catch {
      canPlay = false;
    }

    if (canPlay) {
      soundEnabled = true;
      updateSoundButton();
    } else {
      heroVideo.controls = true;
      soundEnabled = false;
      updateSoundButton();
    }
  });
}
