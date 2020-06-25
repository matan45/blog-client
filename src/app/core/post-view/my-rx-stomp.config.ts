import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import { environment as prod } from 'src/environments/environment.prod';
import { environment } from 'src/environments/environment';

const serverURL = prod.production ? `wss${prod.ServerUrl.substring(5)}/socket/websocket` : `ws${environment.ServerUrl.substring(4)}/socket/websocket`;

export const myRxStompConfig: InjectableRxStompConfig = {
  // Which server?
  brokerURL: `${serverURL}`,

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 500 (500 milli seconds)
  reconnectDelay: 2000,


  // Will log diagnostics on console
  // It can be quite verbose, not recommended in production
  // Skip this key to stop logging to console

  debug: (msg: string): void => {
    if (!environment.production) {
      console.log(new Date(), msg);
    }

  }
};