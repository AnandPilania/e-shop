import laravel from 'laravel-vite-plugin'
import {defineConfig} from 'vite'

export default defineConfig({
    plugins: [
        laravel([
            'resources/js/backEnd.js',
            'resources/js/app.jsx',
        ]),
    ],
    optimizeDeps: {
        // include: ['flatpickr/dist/l10n/fr.js']
      }
});