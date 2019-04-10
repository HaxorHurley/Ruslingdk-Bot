import fetch from 'node-fetch';
import { runInThisContext } from 'vm';

export class TimeFormatter {
  // TODO: This is a crazy hack. Use moment.js instead.
  static formatDateTime(date, locale) {
    return date.toLocaleString(locale);
  }
}

export class Admin {
  constructor(message){
    this.message = message;
  }

  checkAdmin(){
    return ( this.message.guild.roles.find(role => role.name === "Admin") || this.message.member.hasPermission('ADMINISTRATOR'));
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

export class Roles {
  constructor(message, roleRequests){
    this.message = message;
    this.roleRequests = roleRequests
  }

  serverNotSet(){
    return (this.roleRequests[this.message.guild.id] === undefined);
  }
  setServer(){ 
    return {'tutorRequests':{}, 'instruktørRequests': {}, 'konsulentRequests': {}};
  }
}

