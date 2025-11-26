// src/utils/momentConfig.js
import moment from 'moment-timezone';

// Set default timezone global
moment.tz.setDefault('Asia/Jakarta');

// (Opsional) Set default locale
moment.locale('id');

export default moment;