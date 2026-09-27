// Počasie – vyhľadá miesto cez Open-Meteo Geocoding a zobrazí aktuálne počasie a predpoveď.
// Open-Meteo je bezplatné a nevyžaduje API kľúč.

const WEATHER_CODES = {
  0: ["Jasno", "☀️"],
  1: ["Prevažne jasno", "🌤️"],
  2: ["Polojasno", "⛅"],
  3: ["Zamračené", "☁️"],
  45: ["Hmla", "🌫️"],
  48: ["Hmla s námrazou", "🌫️"],
  51: ["Slabé mrholenie", "🌦️"],
  53: ["Mrholenie", "🌦️"],
  55: ["Silné mrholenie", "🌧️"],
  56: ["Mrznúce mrholenie", "🌧️"],
  57: ["Silné mrznúce mrholenie", "🌧️"],
  61: ["Slabý dážď", "🌦️"],
  63: ["Dážď", "🌧️"],
  65: ["Silný dážď", "🌧️"],
  66: ["Mrznúci dážď", "🌧️"],
  67: ["Silný mrznúci dážď", "🌧️"],
  71: ["Slabé sneženie", "🌨️"],
  73: ["Sneženie", "🌨️"],
  75: ["Silné sneženie", "❄️"],
  77: ["Snehové zrná", "🌨️"],
  80: ["Slabé prehánky", "🌦️"],
  81: ["Prehánky", "🌧️"],
  82: ["Silné prehánky", "⛈️"],
  85: ["Snehové prehánky", "🌨️"],
  86: ["Silné snehové prehánky", "❄️"],
  95: ["Búrka", "⛈️"],
  96: ["Búrka s krupobitím", "⛈️"],
  99: ["Silná búrka s krupobitím", "⛈️"],
};

const $ = (id) => document.getElementById(id);
const describe = (code) => WEATHER_CODES[code] || ["Neznáme", "❔"];

async function findPlace(name) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.search = new URLSearchParams({ name, count: 1, language: "sk", format: "json" });
  const res = await fetch(url);
  if (!res.ok) throw new Error("Nepodarilo sa vyhľadať miesto.");
  const data = await res.json();
  if (!data.results || data.results.length === 0) return null;
  return data.results[0];
}

async function getWeather(lat, lon) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: 5,
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error("Nepodarilo sa načítať počasie.");
  return res.json();
}

function render(place, w) {
  const c = w.current;
  const [text, icon] = describe(c.weather_code);
  $("place").textContent = [place.name, place.admin1, place.country].filter(Boolean).join(", ");
  $("icon").textContent = icon;
  $("temp").textContent = `${Math.round(c.temperature_2m)} °C`;
  $("desc").textContent = text;
  $("feels").textContent = `${Math.round(c.apparent_temperature)} °C`;
  $("humidity").textContent = `${c.relative_humidity_2m} %`;
  $("wind").textContent = `${Math.round(c.wind_speed_10m)} km/h`;

  const fmt = new Intl.DateTimeFormat("sk-SK", { weekday: "short", day: "numeric", month: "numeric" });
  $("days").innerHTML = "";
  w.daily.time.forEach((day, i) => {
    const [dText, dIcon] = describe(w.daily.weather_code[i]);
    const li = document.createElement("li");
    li.title = dText;
    li.innerHTML = `
      <div class="d">${fmt.format(new Date(day + "T12:00"))}</div>
      <div class="i">${dIcon}</div>
      <div>${Math.round(w.daily.temperature_2m_max[i])}° / ${Math.round(w.daily.temperature_2m_min[i])}°</div>`;
    $("days").appendChild(li);
  });
  $("result").hidden = false;
}

async function search(name) {
  $("status").textContent = "Načítavam…";
  $("result").hidden = true;
  try {
    const place = await findPlace(name);
    if (!place) {
      $("status").textContent = `Miesto „${name}“ som nenašiel.`;
      return;
    }
    const weather = await getWeather(place.latitude, place.longitude);
    render(place, weather);
    $("status").textContent = "";
    history.replaceState(null, "", `?q=${encodeURIComponent(name)}`);
  } catch (err) {
    $("status").textContent = err.message;
  }
}

$("search").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("city").value.trim();
  if (name) search(name);
});

// Umožní zdieľať odkaz typu ...?q=Košice
const q = new URLSearchParams(location.search).get("q");
if (q) {
  $("city").value = q;
  search(q);
}
