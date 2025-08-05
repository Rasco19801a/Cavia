// Event System module - centralized event handling
export class EventSystem {
    constructor() {
        this.listeners = new Map();
        this.eventQueue = [];
        this.processing = false;
    }

    /**
     * Subscribe to an event
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function to execute
     * @param {Object} context - Context to bind the callback to
     * @returns {Function} Unsubscribe function
     */
    on(eventName, callback, context = null) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }

        const listener = { callback, context };
        this.listeners.get(eventName).push(listener);

        // Return unsubscribe function
        return () => {
            const listeners = this.listeners.get(eventName);
            if (listeners) {
                const index = listeners.indexOf(listener);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
            }
        };
    }

    /**
     * Subscribe to an event that only fires once
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function to execute
     * @param {Object} context - Context to bind the callback to
     */
    once(eventName, callback, context = null) {
        const unsubscribe = this.on(eventName, (...args) => {
            unsubscribe();
            callback.apply(context, args);
        });
    }

    /**
     * Emit an event
     * @param {string} eventName - Name of the event
     * @param {...any} args - Arguments to pass to listeners
     */
    emit(eventName, ...args) {
        this.eventQueue.push({ eventName, args });
        this.processQueue();
    }

    /**
     * Emit an event immediately without queuing
     * @param {string} eventName - Name of the event
     * @param {...any} args - Arguments to pass to listeners
     */
    emitImmediate(eventName, ...args) {
        const listeners = this.listeners.get(eventName);
        if (listeners) {
            listeners.forEach(({ callback, context }) => {
                try {
                    callback.apply(context, args);
                } catch (error) {
                    console.error(`Error in event listener for ${eventName}:`, error);
                }
            });
        }
    }

    /**
     * Process the event queue
     */
    processQueue() {
        if (this.processing || this.eventQueue.length === 0) {
            return;
        }

        this.processing = true;
        
        while (this.eventQueue.length > 0) {
            const { eventName, args } = this.eventQueue.shift();
            this.emitImmediate(eventName, ...args);
        }

        this.processing = false;
    }

    /**
     * Remove all listeners for an event
     * @param {string} eventName - Name of the event
     */
    off(eventName) {
        this.listeners.delete(eventName);
    }

    /**
     * Remove all listeners
     */
    clear() {
        this.listeners.clear();
        this.eventQueue = [];
    }

    /**
     * Get the number of listeners for an event
     * @param {string} eventName - Name of the event
     * @returns {number} Number of listeners
     */
    listenerCount(eventName) {
        const listeners = this.listeners.get(eventName);
        return listeners ? listeners.length : 0;
    }
}

// Game-specific events
export const GameEvents = {
    // Player events
    PLAYER_MOVE: 'player:move',
    PLAYER_COLLECT_ITEM: 'player:collect',
    PLAYER_ENTER_BUILDING: 'player:enterBuilding',
    PLAYER_EXIT_BUILDING: 'player:exitBuilding',
    
    // World events
    WORLD_CHANGE: 'world:change',
    WORLD_LOADED: 'world:loaded',
    
    // UI events
    UI_NOTIFICATION: 'ui:notification',
    UI_MODAL_OPEN: 'ui:modalOpen',
    UI_MODAL_CLOSE: 'ui:modalClose',
    UI_UPDATE_DISPLAY: 'ui:updateDisplay',
    
    // Game state events
    GAME_START: 'game:start',
    GAME_PAUSE: 'game:pause',
    GAME_RESUME: 'game:resume',
    GAME_SAVE: 'game:save',
    GAME_LOAD: 'game:load',
    
    // Mission events
    MISSION_START: 'mission:start',
    MISSION_PROGRESS: 'mission:progress',
    MISSION_COMPLETE: 'mission:complete',
    
    // Item events
    ITEM_ADD: 'item:add',
    ITEM_REMOVE: 'item:remove',
    ITEM_DRAG_START: 'item:dragStart',
    ITEM_DRAG_END: 'item:dragEnd',
    
    // Shop events
    SHOP_OPEN: 'shop:open',
    SHOP_CLOSE: 'shop:close',
    SHOP_PURCHASE: 'shop:purchase',
    
    // Minigame events
    MINIGAME_START: 'minigame:start',
    MINIGAME_END: 'minigame:end',
    MINIGAME_SCORE: 'minigame:score'
};

// Create a singleton instance
export const eventSystem = new EventSystem();