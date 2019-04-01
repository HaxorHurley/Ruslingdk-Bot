import fetch from 'node-fetch';

export class TimeFormatter {
  // TODO: This is a crazy hack. Use moment.js instead.
  static formatDateTime(date, locale) {
    return date.toLocaleString(locale);
  }
}

export class ApiService {
  constructor(message, host) {
    this.message = message;
    this.host = host;
  }

  getBaseUrl() { return `http://${this.host}.rusling.dk/`; }
  getEventUrl() { return `http://${this.host}.rusling.dk/event/`; }
  getEventsUrl() { return `http://${this.host}.rusling.dk/events.json`; }

  getEvents() {
    return fetch(this.getEventsUrl())
      .catch((err) => {
        console.log('Fetch Error :-S', err);
      });
  }
}
