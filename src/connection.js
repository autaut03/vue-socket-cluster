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
            if(data == '#1') return;

            let payload = JSON.parse(data);
            console.log(payload);
            Emitter.emit(formatInternal(payload.event) , payload.data);
        });
    }
}

export default Connection;
