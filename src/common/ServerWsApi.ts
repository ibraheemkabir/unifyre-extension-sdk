import {Injectable, Logger, LoggerFactory, ValidationUtils} from "ferrum-plumbing";
import {WebSocketMessage} from "./model/WebSocketMessage";

const PING_PERIOD = 5000;

export class WsConnectionEvents {
  static readonly OFFLINE = '__CONNECTION_OFFLINE__';
  static readonly ONLINE = '__CONNECTION_ONLINE__';
}

export interface WsEventPublisher {
  pubWsEvent(msg: WebSocketMessage): void;
}

export class ServerWsApi implements Injectable {
  private socket: any = undefined;
  private lastToken: string = '';
  private lastPong: number = 0;
  private log: Logger;
  private interval: any;
  constructor(private baseUri: string,
              private publisher: WsEventPublisher,
              logFac: LoggerFactory) {
    this.log = logFac.getLogger(ServerWsApi);
    this.state = this.state.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onError = this.onError.bind(this);
    this.ping = this.ping.bind(this);
  }
  __name__(): string { return 'ServerWsApi'; }

  async init(authToken: string) {
    ValidationUtils.isTrue(!!authToken, '"authToken" must be provided');
    if (['OPEN', 'CONNECTING'].indexOf(this.state() as any) >= 0) {
      if (authToken !== this.lastToken) {
        this.lastToken = authToken;
        this.socket.close(1000, 'Changing signing token');
      }
    } else { // already disconnected
      this.lastToken = authToken;
      this.reconnect();
      if (!this.interval) {
        this.interval = setInterval(this.ping, PING_PERIOD);
      }
    }
  }

  state(): 'OPEN' | 'CONNECTING' | 'CLOSED' | 'CLOSING' | 'UNKNOWN' | undefined {
    if (!this.socket) { return; }
    switch (this.socket.readyState) {
      case 0: return 'CONNECTING';
      case 1: return 'OPEN';
      case 2: return 'CLOSING';
      case 3: return 'CLOSED';
      default: return 'UNKNOWN';
    }
  }

  private reconnect() {
    if (this.socket) {
      try{this.socket.close();}catch (e) {}
      this.socket = null;
    }
    this.publisher.pubWsEvent({ type: WsConnectionEvents.OFFLINE, payload: {} });

    if (!this.lastToken) {
      this.log.info("Ignoring re-connect. No token found");
      return;
    }

    // @ts-ignore
    this.socket = new WebSocket(`${this.baseUri}?authorization=${this.lastToken}`);
    this.log.info('Connecting to ', this.baseUri);
    this.socket.onopen = this.onOpen;
    this.socket.onmessage = this. onMessage;
    this.socket.onclose = this.onClose;
    this.socket.onerror = this.onError;
  }

  private onOpen(e: any) {
    this.log.info('Connected to ', this.baseUri);
    this.publisher.pubWsEvent({ type: WsConnectionEvents.ONLINE, payload: {} });
    // nothing
  }

  private onMessage(msg: any) {
    // this.log.info('MSG GOT', msg.data);
    if (msg && msg.data) {
      if (msg.data === 'PONG') {
        this.lastPong = Date.now();
      } else {
        // Process the message
        try {
          const jMsg = JSON.parse(msg.data) as WebSocketMessage;
          if (!jMsg.type) {
            this.log.error(`endpoing ${this.baseUri} received a message with no type: ${msg.data}`);
          } else {
            // this.log.info('ABOUT TO PUBLISH EVENT', jMsg);
            this.publisher.pubWsEvent(jMsg);
          }
        } catch (e) {
          this.log.error('Bad message received: ', msg.data, e);
        }
      }
    }
  }

  private onClose(e: any) {
    // Try to reconnect.
    this.log.info('Connection closed', e.wasClean, 'code', e.code, 'reason', e.reason);
  }

  private onError(e: any) {
    // Try to reconnect.
    this.log.error('Connection error', this.baseUri, e.message);
    // Stop reconnection of there is auth error
    if ((e.message || '').indexOf(' 403') > 0 || e.toString().indexOf(' 403') > 0 ) {
      this.log.error('Websocket authentication error detected. Stopping PING/PONG');
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  private ping() {
    if (this.state() === 'OPEN') {
      this.socket.send('PING');
    } else if (this.state() !== 'CONNECTING') {
      if ( (Date.now() - this.lastPong) > (PING_PERIOD * 6) ) {
        this.log.error('Took more than 3 PING periods and no PONG!');
        this.reconnect();
      }
    }
  }
}
