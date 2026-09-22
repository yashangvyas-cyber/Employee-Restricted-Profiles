/** Breakpoints and scale copied from CollabCRM's compiled stylesheet
 *  (assets/index-541540e9.css, crawled 2026-09-21):
 *    2xl        -> @media (min-width: 1536px)
 *    3xl        -> @media (min-width: 1620px)
 *    2xl-to-xl  -> @media (min-width: 1500px) and (max-width: 1680px)
 *  The app's own compiled CSS ships in public/collabcrm/collabcrm-app.css and
 *  provides every class copied from the DOM. Tailwind here is glue only. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      screens: {
        '2xl': '1536px',
        '3xl': '1620px',
        '2xl-to-xl': { min: '1500px', max: '1680px' },
      },
      fontSize: { xxs: '0.625rem' },
      /* Shades copied verbatim out of the app's own compiled stylesheet
         (assets/index-541540e9.css). Registered here so Tailwind can generate
         VARIANTS the app never compiled - e.g. hover:bg-warning-50, which the
         restricted-row hover needs. The base classes still resolve against the
         app CSS; these only add the variants. */
      colors: {
        warning: { 25: 'rgb(255 252 245)', 50: 'rgb(255 250 235)', 100: 'rgb(254 240 199)',
                   400: 'rgb(253 176 34)', 500: 'rgb(247 144 9)', 600: 'rgb(220 104 3)' },
        success: { 25: 'rgb(246 254 249)', 50: 'rgb(236 253 243)', 100: 'rgb(220 250 230)',
                   200: 'rgb(171 239 198)', 500: 'rgb(23 178 106)', 600: 'rgb(7 148 85)' },
        error:   { 25: 'rgb(255 251 250)', 50: 'rgb(254 243 242)', 100: 'rgb(254 228 226)',
                   200: 'rgb(254 205 202)', 400: 'rgb(249 112 102)', 500: 'rgb(240 68 56)',
                   600: 'rgb(217 45 32)' },
      },
      fontFamily: { sans: ['Inter var', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
