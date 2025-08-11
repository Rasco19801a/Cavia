// UI Components module - reusable UI elements
import { domManager } from './dom-manager.js';
import { eventSystem, GameEvents } from './event-system.js';

export class UIComponents {
    /**
     * Create a modal component
     * @param {Object} config - Modal configuration
     * @returns {HTMLElement} Modal element
     */
    static createModal(config) {
        const modal = domManager.createElement('div', {
            id: config.id,
            className: `modal ${config.className || ''}`,
            style: {
                display: 'none',
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: '1000'
            }
        });

        const content = domManager.createElement('div', {
            className: 'modal-content',
            style: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                maxWidth: config.maxWidth || '500px',
                width: '90%'
            }
        });

        if (config.title) {
            const header = domManager.createElement('div', {
                className: 'modal-header',
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                }
            });

            const title = domManager.createElement('h2', {
                style: {
                    margin: '0',
                    color: '#333'
                }
            }, [config.title]);

            const closeBtn = domManager.createElement('button', {
                className: 'modal-close',
                style: {
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#999'
                },
                onclick: () => this.closeModal(modal)
            }, ['×']);

            header.appendChild(title);
            header.appendChild(closeBtn);
            content.appendChild(header);
        }

        if (config.body) {
            const body = domManager.createElement('div', {
                className: 'modal-body'
            });
            
            if (typeof config.body === 'string') {
                body.innerHTML = config.body;
            } else {
                body.appendChild(config.body);
            }
            
            content.appendChild(body);
        }

        if (config.footer) {
            const footer = domManager.createElement('div', {
                className: 'modal-footer',
                style: {
                    marginTop: '20px',
                    textAlign: 'right'
                }
            });
            
            if (typeof config.footer === 'string') {
                footer.innerHTML = config.footer;
            } else {
                footer.appendChild(config.footer);
            }
            
            content.appendChild(footer);
        }

        modal.appendChild(content);

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // Close on escape key
        if (config.closeOnEscape !== false) {
            const escapeHandler = (e) => {
                if (e.key === 'Escape' && modal.style.display !== 'none') {
                    this.closeModal(modal);
                }
            };
            window.addEventListener('keydown', escapeHandler);
            modal._escapeHandler = escapeHandler;
        }

        return modal;
    }

    /**
     * Open a modal
     * @param {HTMLElement} modal - Modal element
     */
    static openModal(modal) {
        modal.style.display = 'block';
        eventSystem.emit(GameEvents.UI_MODAL_OPEN, modal.id);
    }

    /**
     * Close a modal
     * @param {HTMLElement} modal - Modal element
     */
    static closeModal(modal) {
        modal.style.display = 'none';
        eventSystem.emit(GameEvents.UI_MODAL_CLOSE, modal.id);
        
        // Clean up escape handler
        if (modal._escapeHandler) {
            window.removeEventListener('keydown', modal._escapeHandler);
            delete modal._escapeHandler;
        }
    }

    /**
     * Create a button component
     * @param {Object} config - Button configuration
     * @returns {HTMLElement} Button element
     */
    static createButton(config) {
        const button = domManager.createElement('button', {
            id: config.id,
            className: `btn ${config.className || ''}`,
            style: {
                padding: '10px 20px',
                fontSize: '16px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: config.color || '#4CAF50',
                color: config.textColor || 'white',
                ...config.style
            },
            onclick: config.onClick
        }, [config.text]);

        // Add hover effect
        button.addEventListener('mouseenter', () => {
            button.style.opacity = '0.8';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.opacity = '1';
        });

        return button;
    }

    /**
     * Create a card component
     * @param {Object} config - Card configuration
     * @returns {HTMLElement} Card element
     */
    static createCard(config) {
        const card = domManager.createElement('div', {
            className: `card ${config.className || ''}`,
            style: {
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                marginBottom: '20px',
                ...config.style
            }
        });

        if (config.title) {
            const title = domManager.createElement('h3', {
                className: 'card-title',
                style: {
                    marginTop: '0',
                    marginBottom: '15px',
                    color: '#333'
                }
            }, [config.title]);
            card.appendChild(title);
        }

        if (config.content) {
            const content = domManager.createElement('div', {
                className: 'card-content'
            });
            
            if (typeof config.content === 'string') {
                content.innerHTML = config.content;
            } else {
                content.appendChild(config.content);
            }
            
            card.appendChild(content);
        }

        if (config.actions) {
            const actions = domManager.createElement('div', {
                className: 'card-actions',
                style: {
                    marginTop: '15px',
                    display: 'flex',
                    gap: '10px',
                    justifyContent: config.actionsAlign || 'flex-end'
                }
            });
            
            config.actions.forEach(action => {
                const btn = this.createButton(action);
                actions.appendChild(btn);
            });
            
            card.appendChild(actions);
        }

        return card;
    }

    /**
     * Create a notification component
     * @param {Object} config - Notification configuration
     * @returns {HTMLElement} Notification element
     */
    static createNotification(config) {
        const notification = domManager.createElement('div', {
            className: `notification ${config.type || 'info'}`,
            style: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '15px 20px',
                borderRadius: '5px',
                backgroundColor: this.getNotificationColor(config.type),
                color: 'white',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                zIndex: '2000',
                maxWidth: '300px',
                animation: 'slideIn 0.3s ease-out'
            }
        });

        const message = domManager.createElement('div', {
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }
        });

        // Add icon
        const icon = domManager.createElement('span', {
            style: {
                fontSize: '20px'
            }
        }, [this.getNotificationIcon(config.type)]);
        message.appendChild(icon);

        // Add text
        const text = domManager.createElement('span', {}, [config.message]);
        message.appendChild(text);

        notification.appendChild(message);

        // Auto-dismiss
        if (config.duration !== 0) {
            setTimeout(() => {
                this.dismissNotification(notification);
            }, config.duration || 3000);
        }

        // Close button
        if (config.closable !== false) {
            const closeBtn = domManager.createElement('button', {
                style: {
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px'
                },
                onclick: () => this.dismissNotification(notification)
            }, ['×']);
            notification.appendChild(closeBtn);
        }

        return notification;
    }

    /**
     * Dismiss a notification
     * @param {HTMLElement} notification - Notification element
     */
    static dismissNotification(notification) {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    /**
     * Get notification background color
     * @param {string} type - Notification type
     * @returns {string} Background color
     */
    static getNotificationColor(type) {
        const colors = {
            success: '#4CAF50',
            error: '#F44336',
            warning: '#FF9800',
            info: '#2196F3'
        };
        return colors[type] || colors.info;
    }

    /**
     * Get notification icon
     * @param {string} type - Notification type
     * @returns {string} Icon
     */
    static getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    /**
     * Create a progress bar component
     * @param {Object} config - Progress bar configuration
     * @returns {HTMLElement} Progress bar element
     */
    static createProgressBar(config) {
        const container = domManager.createElement('div', {
            className: 'progress-container',
            style: {
                width: '100%',
                backgroundColor: '#E0E0E0',
                borderRadius: '10px',
                overflow: 'hidden',
                height: config.height || '20px',
                ...config.containerStyle
            }
        });

        const bar = domManager.createElement('div', {
            className: 'progress-bar',
            style: {
                width: `${config.progress || 0}%`,
                height: '100%',
                backgroundColor: config.color || '#4CAF50',
                transition: 'width 0.3s ease',
                ...config.barStyle
            }
        });

        if (config.showText) {
            const text = domManager.createElement('span', {
                style: {
                    position: 'absolute',
                    width: '100%',
                    textAlign: 'center',
                    lineHeight: config.height || '20px',
                    color: config.textColor || '#333'
                }
            }, [`${config.progress || 0}%`]);
            
            container.style.position = 'relative';
            container.appendChild(text);
        }

        container.appendChild(bar);
        
        // Store reference for updates
        container._progressBar = bar;
        container._progressText = container.querySelector('span');

        return container;
    }

    /**
     * Update progress bar
     * @param {HTMLElement} container - Progress bar container
     * @param {number} progress - Progress value (0-100)
     */
    static updateProgressBar(container, progress) {
        const bar = container._progressBar;
        const text = container._progressText;
        
        if (bar) {
            bar.style.width = `${progress}%`;
        }
        
        if (text) {
            text.textContent = `${progress}%`;
        }
    }

    /**
     * Create a tooltip component
     * @param {HTMLElement} element - Element to attach tooltip to
     * @param {Object} config - Tooltip configuration
     */
    static createTooltip(element, config) {
        const tooltip = domManager.createElement('div', {
            className: 'tooltip',
            style: {
                position: 'absolute',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '5px',
                fontSize: '14px',
                zIndex: '3000',
                display: 'none',
                pointerEvents: 'none',
                ...config.style
            }
        }, [config.text]);

        document.body.appendChild(tooltip);

        element.addEventListener('mouseenter', (e) => {
            const rect = element.getBoundingClientRect();
            tooltip.style.display = 'block';
            
            // Position tooltip
            const position = config.position || 'top';
            switch (position) {
                case 'top':
                    tooltip.style.left = `${rect.left + rect.width / 2}px`;
                    tooltip.style.top = `${rect.top - 10}px`;
                    tooltip.style.transform = 'translate(-50%, -100%)';
                    break;
                case 'bottom':
                    tooltip.style.left = `${rect.left + rect.width / 2}px`;
                    tooltip.style.top = `${rect.bottom + 10}px`;
                    tooltip.style.transform = 'translate(-50%, 0)';
                    break;
                case 'left':
                    tooltip.style.left = `${rect.left - 10}px`;
                    tooltip.style.top = `${rect.top + rect.height / 2}px`;
                    tooltip.style.transform = 'translate(-100%, -50%)';
                    break;
                case 'right':
                    tooltip.style.left = `${rect.right + 10}px`;
                    tooltip.style.top = `${rect.top + rect.height / 2}px`;
                    tooltip.style.transform = 'translate(0, -50%)';
                    break;
            }
        });

        element.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });

        // Store reference for cleanup
        element._tooltip = tooltip;
    }

    /**
     * Remove tooltip
     * @param {HTMLElement} element - Element with tooltip
     */
    static removeTooltip(element) {
        if (element._tooltip) {
            element._tooltip.remove();
            delete element._tooltip;
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);