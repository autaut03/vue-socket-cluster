import socketCluster from 'socketcluster-client';
import defaultSocketEvents from './defaultSocketEvents';
import Emitter from './emitter';
import { formatInternal } from './utils';

class Connection {
    constructor(connection) {
        this.connection = socketCluster.connect(connection);
        defaultSocketEvents.map(event => {
            this.connection.on(event, payload => {
                Emitter.emit(formatInternal(event), payload);
            });
        });

        this.connection.on('message', data => {
            if(data == '#1') 
				return;
            let payload = JSON.parse(data);
			
			if(!payload.event)
				return;
			
            if(payload.event == '#publish') {
                Emitter.emit(payload.data.data.event, payload.data.data.data);
				return;
            }
			
			if(payload.event.startsWith('#'))
				return;

            Emitter.emit(payload.event, payload.data);
        });
    }
}

export default Connection;
