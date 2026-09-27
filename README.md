# Počasie

Jednoduchá webová stránka: zadáš mesto do vyhľadávania a zobrazí sa aktuálne počasie a predpoveď na 5 dní.

- Čisté HTML + CSS + JavaScript, bez inštalácie a bez servera.
- Dáta: [Open-Meteo](https://open-meteo.com/), zadarmo, bez API kľúča.
- Dá sa zdieľať odkaz na konkrétne mesto: `.../?q=Košice`

## Zverejnenie cez GitHub Pages

1. V repozitári otvor **Settings → Pages**.
2. V časti **Build and deployment** zvoľ **Source: Deploy from a branch**.
3. Vyber vetvu `main` a priečinok `/ (root)`, klikni **Save**.
4. Asi o minútu bude stránka na adrese `https://<tvoje-meno>.github.io/<nazov-repa>/`.

## Lokálne spustenie

Stačí otvoriť `index.html` v prehliadači.

## Android aplikácia

Pri každej zmene na vetve `main` GitHub Actions zostaví Android aplikáciu (Capacitor) a zverejní ju v **Releases**.

- Stiahnutie najnovšej verzie: https://github.com/jurozachar-rgb/Weather/releases/latest/download/Pocasie.apk
- Otvor súbor v telefóne a pri prvej inštalácii povoľ inštaláciu z neznámych zdrojov.
- Aplikácia je podpísaná stálym testovacím kľúčom (`android-signing/`), takže nové verzie sa nainštalujú cez staré. Pre Google Play by bol potrebný vlastný tajný kľúč.
