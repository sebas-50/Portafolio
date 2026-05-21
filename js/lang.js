(function () {
  var STORAGE_KEY = 'portfolio-lang';
  var cache = {};
  var currentLang = localStorage.getItem(STORAGE_KEY) || 'es';

  function getBasePath() {
    var scripts = document.querySelectorAll('script[src]');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute('src');
      if (src && src.indexOf('js/lang.js') !== -1) {
        return src.replace('js/lang.js', '');
      }
    }
    var link = document.querySelector('link[rel="stylesheet"][href*="css/styles.css"]');
    if (link) {
      var href = link.getAttribute('href');
      return href.replace('css/styles.css', '');
    }
    return '';
  }

  var basePath = getBasePath();

  function fetchJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) {
          try {
            callback(null, JSON.parse(xhr.responseText));
          } catch (e) {
            callback(e, null);
          }
        } else {
          callback(new Error('HTTP ' + xhr.status), null);
        }
      }
    };
    xhr.send(null);
  }

  function loadLang(lang, callback) {
    if (cache[lang]) {
      callback(null, cache[lang]);
      return;
    }
    fetchJSON(basePath + 'js/lang/' + lang + '.json', function (err, data) {
      if (err) {
        console.error('Error loading ' + lang + '.json:', err);
        callback(err, null);
        return;
      }
      cache[lang] = data;
      callback(null, data);
    });
  }

  function applyTranslations(data) {
    if (!data) return;

    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var key = el.getAttribute('data-i18n');
      if (data[key] !== undefined) {
        el.innerHTML = data[key];
      }
    }

    var placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < placeholders.length; j++) {
      var el2 = placeholders[j];
      var key2 = el2.getAttribute('data-i18n-placeholder');
      if (data[key2] !== undefined) {
        el2.setAttribute('placeholder', data[key2]);
      }
    }

    var ariaElements = document.querySelectorAll('[data-i18n-aria]');
    for (var k = 0; k < ariaElements.length; k++) {
      var el3 = ariaElements[k];
      var key3 = el3.getAttribute('data-i18n-aria');
      if (data[key3] !== undefined) {
        el3.setAttribute('aria-label', data[key3]);
      }
    }

    var titleElements = document.querySelectorAll('[data-i18n-title]');
    for (var m = 0; m < titleElements.length; m++) {
      var el4 = titleElements[m];
      var key4 = el4.getAttribute('data-i18n-title');
      if (data[key4] !== undefined) {
        el4.setAttribute('title', data[key4]);
      }
    }
  }

  function updateToggle(lang) {
    var btn = document.getElementById('langToggle');
    if (!btn) return;
    var otherLang = lang === 'es' ? 'en' : 'es';
    var otherData = cache[otherLang];
    if (lang === 'es') {
      btn.innerHTML = '<span class="lang-flag">\uD83C\uDDFA\uD83C\uDDF8</span> <span class="lang-label">EN</span>';
      btn.setAttribute('aria-label', (otherData && otherData.aria_switch_en) || 'Switch to English');
    } else {
      btn.innerHTML = '<span class="lang-flag">\uD83C\uDDEA\uD83C\uDDF8</span> <span class="lang-label">ES</span>';
      btn.setAttribute('aria-label', (otherData && otherData.aria_switch_es) || 'Cambiar a espa\u00F1ol');
    }
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    loadLang(lang, function (err, data) {
      if (!err) applyTranslations(data);
      updateToggle(lang);
    });
  }

  function init() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) currentLang = saved;
    document.documentElement.lang = currentLang;

    loadLang(currentLang, function (err, data) {
      if (!err) applyTranslations(data);
      updateToggle(currentLang);
      document.documentElement.classList.add('i18n-ready');

      var btn = document.getElementById('langToggle');
      if (btn) {
        btn.addEventListener('click', function () {
          var next = currentLang === 'es' ? 'en' : 'es';
          setLang(next);
        });
      }
    });

    if (currentLang !== 'es') {
      loadLang('es', function () {});
    } else {
      loadLang('en', function () {});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();