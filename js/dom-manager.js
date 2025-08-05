// DOM Manager module - centralized DOM manipulation
import { eventSystem, GameEvents } from './event-system.js';

export class DOMManager {
    constructor() {
        this.elements = new Map();
        this.modals = new Map();
        this.init();
    }

    init() {
        // Cache commonly used elements
        this.cacheElements();
        
        // Setup event listeners
        this.setupEventListeners();
    }

    cacheElements() {
        // Game elements
        this.cacheElement('gameCanvas', 'gameCanvas');
        this.cacheElement('worldSelector', 'worldSelector');
        this.cacheElement('designPanel', '.design-panel');
        
        // UI elements
        this.cacheElement('carrotCount', 'carrotCount');
        this.cacheElement('notification', 'notification');
        
        // Screen elements
        this.cacheElement('tablesScreen', 'tablesScreen');
        this.cacheElement('difficultyScreen', 'difficultyScreen');
        this.cacheElement('customizationScreen', 'customizationScreen');
    }

    cacheElement(name, selector) {
        const element = selector.startsWith('.') ? 
            document.querySelector(selector) : 
            document.getElementById(selector);
        
        if (element) {
            this.elements.set(name, element);
        } else {
            console.warn(`Element not found: ${selector}`);
        }
    }

    getElement(name) {
        return this.elements.get(name);
    }

    setupEventListeners() {
        // Listen for UI events
        eventSystem.on(GameEvents.UI_NOTIFICATION, (message) => {
            this.showNotification(message);
        });

        eventSystem.on(GameEvents.UI_UPDATE_DISPLAY, (data) => {
            this.updateDisplay(data);
        });

        eventSystem.on(GameEvents.UI_MODAL_OPEN, (modalData) => {
            this.openModal(modalData);
        });

        eventSystem.on(GameEvents.UI_MODAL_CLOSE, (modalId) => {
            this.closeModal(modalId);
        });
    }

    showNotification(message, duration = 3000) {
        const notification = this.getElement('notification');
        if (!notification) {
            console.warn('Notification element not found');
            return;
        }

        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
    }

    updateDisplay(data) {
        if (data.carrots !== undefined) {
            const carrotCount = this.getElement('carrotCount');
            if (carrotCount) {
                carrotCount.textContent = data.carrots;
            }
        }
    }

    createModal(config) {
        const modal = document.createElement('div');
        modal.id = config.id;
        modal.className = config.className || 'modal hidden';
        
        if (config.content) {
            modal.innerHTML = config.content;
        }

        document.body.appendChild(modal);
        this.modals.set(config.id, modal);

        // Setup close handlers
        if (config.closeButton) {
            const closeBtn = modal.querySelector(config.closeButton);
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeModal(config.id);
                });
            }
        }

        // Close on escape key if enabled
        if (config.closeOnEscape) {
            const escapeHandler = (e) => {
                if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                    this.closeModal(config.id);
                }
            };
            modal.dataset.escapeHandler = 'true';
            window.addEventListener('keydown', escapeHandler);
            
            // Store handler for cleanup
            modal._escapeHandler = escapeHandler;
        }

        return modal;
    }

    openModal(modalData) {
        let modal = this.modals.get(modalData.id);
        
        if (!modal && modalData.create) {
            modal = this.createModal(modalData);
        }

        if (modal) {
            modal.classList.remove('hidden');
            eventSystem.emit(GameEvents.UI_MODAL_OPEN, modalData.id);
        }
    }

    closeModal(modalId) {
        const modal = this.modals.get(modalId);
        if (modal) {
            modal.classList.add('hidden');
            eventSystem.emit(GameEvents.UI_MODAL_CLOSE, modalId);
        }
    }

    removeModal(modalId) {
        const modal = this.modals.get(modalId);
        if (modal) {
            // Clean up escape handler
            if (modal._escapeHandler) {
                window.removeEventListener('keydown', modal._escapeHandler);
            }
            
            modal.remove();
            this.modals.delete(modalId);
        }
    }

    addClass(elementName, className) {
        const element = this.getElement(elementName);
        if (element) {
            element.classList.add(className);
        }
    }

    removeClass(elementName, className) {
        const element = this.getElement(elementName);
        if (element) {
            element.classList.remove(className);
        }
    }

    toggleClass(elementName, className) {
        const element = this.getElement(elementName);
        if (element) {
            element.classList.toggle(className);
        }
    }

    setStyle(elementName, styles) {
        const element = this.getElement(elementName);
        if (element) {
            Object.assign(element.style, styles);
        }
    }

    setText(elementName, text) {
        const element = this.getElement(elementName);
        if (element) {
            element.textContent = text;
        }
    }

    setHTML(elementName, html) {
        const element = this.getElement(elementName);
        if (element) {
            element.innerHTML = html;
        }
    }

    addEventListener(elementName, event, handler) {
        const element = this.getElement(elementName);
        if (element) {
            element.addEventListener(event, handler);
        }
    }

    removeEventListener(elementName, event, handler) {
        const element = this.getElement(elementName);
        if (element) {
            element.removeEventListener(event, handler);
        }
    }

    // Utility method to create elements
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key.startsWith('on') && typeof value === 'function') {
                element.addEventListener(key.substring(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });

        // Add children
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });

        return element;
    }

    // Clean up method
    destroy() {
        // Remove all modals
        this.modals.forEach((modal, id) => {
            this.removeModal(id);
        });

        // Clear cached elements
        this.elements.clear();
        
        // Clear event listeners
        eventSystem.off(GameEvents.UI_NOTIFICATION);
        eventSystem.off(GameEvents.UI_UPDATE_DISPLAY);
        eventSystem.off(GameEvents.UI_MODAL_OPEN);
        eventSystem.off(GameEvents.UI_MODAL_CLOSE);
    }
}

// Create singleton instance
export const domManager = new DOMManager();