VIHASA MEET - NETLIFY PROJECT
=============================

මෙම ZIP එකේ:
- index.html: Meeting UI + LiveKit browser client
- netlify/functions/token.mjs: ආරක්ෂිත token endpoint
- package.json: LiveKit server SDK dependency
- netlify.toml: Netlify configuration

ANDROID PHONE එකෙන් deploy කරන ආකාරය
--------------------------------------
1. LiveKit Cloud dashboard එකට ගොස් කලින් chat එකේ පෙන්වූ API Secret එක ROTATE/REGENERATE කරන්න.
2. ZIP එක extract කරන්න. ZIP එකේ ගොනු root එකේම index.html, package.json, netlify.toml තිබිය යුතුය.
3. Netlify වෙත login වී site එකක් සාදන්න. Netlify Drop එකෙන් upload කිරීමේදී functions build/run සඳහා Git repository deploy කිරීම වඩාත් විශ්වාසදායකය.
4. GitHub repository එකක් browser එකෙන් සාදා මෙම ZIP එක extract කර ඇති සියලු ගොනු upload කරන්න. netlify/functions/token.mjs ගොනුව එම path එකේම තිබිය යුතුය.
5. Netlify > Add new site > Import an existing project > GitHub > repository තෝරන්න > Deploy.
6. Netlify site එකේ Site configuration/Environment variables වෙත ගොස් මේ තුන එක් කරන්න:
   LIVEKIT_URL = LiveKit Cloud හි WebSocket URL
   LIVEKIT_API_KEY = අලුත් API key
   LIVEKIT_API_SECRET = අලුත් secret
7. Deploys වෙත ගොස් Trigger deploy > Clear cache and deploy site.
8. Published URL එක විවෘත කර Create Meeting / Join Meeting පරීක්ෂා කරන්න.

APP CREATOR 24
--------------
AppCreator24 HTML section එකට index.html එකේ සම්පූර්ණ කේතය paste කිරීමේදී,
relative endpoint '/.netlify/functions/token' AppCreator24 preview origin එකට යා හැකියි.
එබැවින් AppCreator24 HTML embed එකෙන් භාවිත කරන විට fetch URL එක ඔබේ Netlify URL එකට
වෙනස් කරන්න. index.html එකේ fetch('/.netlify/functions/token'...) යන තැන
fetch('https://YOUR-SITE-NAME.netlify.app/.netlify/functions/token'...) ලෙස වෙනස් කරන්න.
ඉන්පසු backend CORS headers එක් කිරීමත් අවශ්‍ය විය හැකියි. වඩාත් පහසු හා විශ්වාසදායක
ක්‍රමය: AppCreator24 Web/Website section එකෙන් published Netlify URL එකම open කරන්න.

සීමාවන් / ආරක්ෂාව
------------------
- API secret එක කිසිවිටක index.html හෝ AppCreator24 HTML එකට දාන්න එපා.
- මෙම demo එකේ room ID එක දන්නා අයට join විය හැකියි; production සඳහා room access
  control, rate limiting සහ abuse protection එකතු කරන්න.
- Browser/app එකේ camera, microphone, screen-share support සහ HTTPS permissions මත
  ක්‍රියාකාරීත්වය වෙනස් විය හැකියි.
- Screen sharing Android WebView/AppCreator24 තුළ ක්‍රියා නොකරන්න පුළුවන්.
- මෙය මූලික demo project එකකි; deploy කර පරීක්ෂා කළ පසු errors අනුව වැඩිදියුණු කළ යුතුය.
