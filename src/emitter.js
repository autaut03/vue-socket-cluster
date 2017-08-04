class Emitter {

    constructor() {
        this.events = new Map();
    }

    addEventHook(event, callback, vm) {
        if(typeof callback != 'function')
            return;

        if(!this.events.has(event))
            this.events.set(event, []);

        this.events.get(event).push({ callback, vm });

    }

    removeListener(event, callback, vm) {
        let hooks = this.events.get(event),
            index;

        if(!hooks || !hooks.length)
            return;

        index = hooks.reduce((i, event, index) => {
            return (typeof event.callback === 'function' && event.callback === callback && event.vm === vm) ?
                i = index :
                i;
        }, -1);

        if (index > -1) {
            hooks.splice(index, 1);
            this.events.set(event, hooks);
        }
    }


    emit(event, ...args) {
        let hooks = this.events.get(event);

        if(!hooks || !hooks.length)
            return;

        hooks.forEach(hook => hook.callback.call(hook.vm, ...args));
    }

}

export default new Emitter;
