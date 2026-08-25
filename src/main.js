import Alpine from 'alpinejs'
import './assets/style.css'

import { app } from './app/app.js'

window.Alpine = Alpine

Alpine.data('app', app)

Alpine.start()