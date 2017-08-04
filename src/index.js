import Connection from './connection';
import Emitter from './emitter';

export default {

    install(Vue, connection) {
        Vue.prototype.$sockets = new Connection(connection).connection;

        Vue.mixin({
	        created(){
                let connectionHook = this.$options.events;

                this.$options[connectionHook] = new Proxy({}, {
                    set: (target, key, value) => {
                        Emitter.addEventHook(key, value, this);
                        target[key] = value;
                        return true;
                    },
                    deleteProperty: (target, key) => {
                        Emitter.removeListener(key, this.$options[connectionHook][key], this);
                        delete target.key;
                        return true;
                    }
                });

                if(connectionHook) {
                    Object.keys(connectionHook).forEach(eventHook => {
                        this.$options[connectionHook][eventHook] = connectionHook[eventHook];
                    });
                }
	        },
	        beforeDestroy(){
                let connectionHook = this.$options.events;

                if(!connectionHook)
                    return;

                Object.keys(connectionHook).forEach((eventHook) => {
                    delete this.$options[connectionHook][eventHook];
                });
	        }
        })
    }
};