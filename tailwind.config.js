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
      fontFamily: { sans: ['Inter var', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
