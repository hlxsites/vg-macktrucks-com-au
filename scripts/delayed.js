// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadScript } from './lib-franklin.js';

const COOKIES = {
  performance: 'C0002:1',
  social: 'C0005:1',
};

// check if the active campaign is running
const activeCampaign = true;

// Core Web Vitals RUM collection
sampleRUM('cwv');

const cookieSetting = decodeURIComponent(document.cookie.split(';')
  .find((cookie) => cookie.trim().startsWith('OptanonConsent=')));
const isPerformanceAllowed = activeCampaign || cookieSetting.includes(COOKIES.performance);
const isSocialAllowed = activeCampaign || cookieSetting.includes(COOKIES.social);

if (isPerformanceAllowed) {
  loadGoogleTagManager();
  loadHotjar();
}

if (isSocialAllowed) {
  loadFacebookPixel();
  loadLinkedInInsightTag();
}

// add more delayed functionality here

// Prevent the cookie banner from loading when running in library
if (!window.location.pathname.includes('srcdoc')
  && !['localhost', 'hlx.page'].some((url) => window.location.host.includes(url))) {
  loadScript('https://cdn.cookielaw.org/scripttemplates/otSDKStub.js', {
    type: 'text/javascript',
    charset: 'UTF-8',
    'data-domain-script': 'cfb3642f-723b-40b4-8af8-ca9252e753b4',
  });
}

window.OptanonWrapper = () => {
  const currentOnetrustActiveGroups = window.OnetrustActiveGroups;

  function isSameGroups(groups1, groups2) {
    const s1 = JSON.stringify(groups1.split(',').sort());
    const s2 = JSON.stringify(groups2.split(',').sort());

    return s1 === s2;
  }

  window.OneTrust.OnConsentChanged(() => {
    // reloading the page only when the active group has changed
    if (!isSameGroups(currentOnetrustActiveGroups, window.OnetrustActiveGroups)) {
      window.location.reload();
    }
  });
};

// Google Analytics
async function loadGoogleTagManager() {
  // google tag manager
  // eslint-disable-next-line func-names
  (function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' }); const f = d.getElementsByTagName(s)[0]; const j = d.createElement(s); const
      dl = l !== 'dataLayer' ? `&l=${l}` : ''; j.async = true; j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`; f.parentNode.insertBefore(j, f);
  }(window, document, 'script', 'dataLayer', 'GTM-K6KJGCW'));
}

// Hotjar
async function loadHotjar() {
  /* eslint-disable */
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:740766,hjsv:6}; a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  /* eslint-enable */
}

// FaceBook Pixel
async function loadFacebookPixel() {
  /* eslint-disable */
  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq)f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js',
  ));
  fbq('init', '227457244665842');
  fbq('track', 'PageView');
  /* eslint-enable */
}

// linkedIn Insight Tag
async function loadLinkedInInsightTag() {
  /* eslint-disable */
  var _linkedin_partner_id = "5894996";
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
  window._linkedin_data_partner_ids.push(_linkedin_partner_id);

  (function(l) {
    if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
    window.lintrk.q=[]}
    var s = document.getElementsByTagName("script")[0];
    var b = document.createElement("script");
    b.type = "text/javascript";b.async = true;
    b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    s.parentNode.insertBefore(b, s);
  })(window.lintrk);
  /* eslint-enable */
}
