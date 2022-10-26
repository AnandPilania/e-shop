import laravel from 'laravel-vite-plugin'
import {defineConfig} from 'vite'

export default defineConfig({
    plugins: [
        laravel([
            'resources/js/backEnd.js',
        ]),
    ],
    optimizeDeps: {
        // include: ['flatpickr/dist/l10n/fr.js']
      }
});