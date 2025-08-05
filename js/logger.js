// Logger module - centralized logging and error handling
import { eventSystem } from './event-system.js';

// Log levels
export const LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    FATAL: 4
};

// Log level names for display
const LogLevelNames = {
    [LogLevel.DEBUG]: 'DEBUG',
    [LogLevel.INFO]: 'INFO',
    [LogLevel.WARN]: 'WARN',
    [LogLevel.ERROR]: 'ERROR',
    [LogLevel.FATAL]: 'FATAL'
};

// Log level colors for console output
const LogLevelColors = {
    [LogLevel.DEBUG]: '#888',
    [LogLevel.INFO]: '#4CAF50',
    [LogLevel.WARN]: '#FF9800',
    [LogLevel.ERROR]: '#F44336',
    [LogLevel.FATAL]: '#9C27B0'
};

export class Logger {
    constructor(name = 'Game') {
        this.name = name;
        this.minLevel = LogLevel.INFO; // Default minimum level
        this.logs = [];
        this.maxLogs = 1000; // Maximum logs to keep in memory
        this.handlers = new Map();
        
        // Default console handler
        this.addHandler('console', this.consoleHandler.bind(this));
        
        // Setup error tracking
        this.setupErrorTracking();
    }

    setupErrorTracking() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.error('Uncaught error', {
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                error: event.error
            });
        });

        // Promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.error('Unhandled promise rejection', {
                reason: event.reason,
                promise: event.promise
            });
        });
    }

    setLevel(level) {
        this.minLevel = level;
    }

    addHandler(name, handler) {
        this.handlers.set(name, handler);
    }

    removeHandler(name) {
        this.handlers.delete(name);
    }

    log(level, message, data = null) {
        if (level < this.minLevel) {
            return;
        }

        const logEntry = {
            timestamp: new Date().toISOString(),
            level: level,
            levelName: LogLevelNames[level],
            logger: this.name,
            message: message,
            data: data
        };

        // Store in memory
        this.logs.push(logEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Call all handlers
        this.handlers.forEach(handler => {
            try {
                handler(logEntry);
            } catch (error) {
                console.error('Error in log handler:', error);
            }
        });

        // Emit log event
        eventSystem.emit('log:entry', logEntry);
    }

    debug(message, data) {
        this.log(LogLevel.DEBUG, message, data);
    }

    info(message, data) {
        this.log(LogLevel.INFO, message, data);
    }

    warn(message, data) {
        this.log(LogLevel.WARN, message, data);
    }

    error(message, data) {
        this.log(LogLevel.ERROR, message, data);
    }

    fatal(message, data) {
        this.log(LogLevel.FATAL, message, data);
    }

    // Default console handler
    consoleHandler(logEntry) {
        const color = LogLevelColors[logEntry.level];
        const prefix = `%c[${logEntry.timestamp}] [${logEntry.levelName}] [${logEntry.logger}]`;
        const style = `color: ${color}; font-weight: bold;`;
        
        if (logEntry.data) {
            console.log(prefix, style, logEntry.message, logEntry.data);
        } else {
            console.log(prefix, style, logEntry.message);
        }
    }

    // Get logs filtered by level
    getLogs(minLevel = LogLevel.DEBUG) {
        return this.logs.filter(log => log.level >= minLevel);
    }

    // Clear all logs
    clearLogs() {
        this.logs = [];
    }

    // Export logs as JSON
    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }

    // Create a child logger with a different name
    child(name) {
        const childLogger = new Logger(`${this.name}.${name}`);
        childLogger.minLevel = this.minLevel;
        
        // Copy handlers
        this.handlers.forEach((handler, handlerName) => {
            childLogger.addHandler(handlerName, handler);
        });
        
        return childLogger;
    }
}

// Error handler class
export class ErrorHandler {
    constructor(logger) {
        this.logger = logger;
        this.errorHandlers = new Map();
        this.setupDefaultHandlers();
    }

    setupDefaultHandlers() {
        // Network errors
        this.addErrorHandler('NetworkError', (error) => {
            this.logger.error('Network error occurred', {
                message: error.message,
                url: error.url,
                status: error.status
            });
            eventSystem.emit('error:network', error);
        });

        // Game state errors
        this.addErrorHandler('GameStateError', (error) => {
            this.logger.error('Game state error', {
                message: error.message,
                state: error.state,
                action: error.action
            });
            eventSystem.emit('error:gameState', error);
        });

        // Asset loading errors
        this.addErrorHandler('AssetLoadError', (error) => {
            this.logger.error('Failed to load asset', {
                asset: error.asset,
                type: error.type,
                message: error.message
            });
            eventSystem.emit('error:assetLoad', error);
        });
    }

    addErrorHandler(errorType, handler) {
        this.errorHandlers.set(errorType, handler);
    }

    handleError(error) {
        const errorType = error.constructor.name;
        const handler = this.errorHandlers.get(errorType);
        
        if (handler) {
            try {
                handler(error);
            } catch (handlerError) {
                this.logger.fatal('Error in error handler', {
                    originalError: error,
                    handlerError: handlerError
                });
            }
        } else {
            // Default error handling
            this.logger.error('Unhandled error', {
                type: errorType,
                message: error.message,
                stack: error.stack
            });
        }
    }

    // Utility method for safe function execution
    tryCatch(fn, context = null, fallback = null) {
        try {
            return fn.call(context);
        } catch (error) {
            this.handleError(error);
            return fallback;
        }
    }

    // Async version
    async tryCatchAsync(fn, context = null, fallback = null) {
        try {
            return await fn.call(context);
        } catch (error) {
            this.handleError(error);
            return fallback;
        }
    }
}

// Performance monitoring
export class PerformanceMonitor {
    constructor(logger) {
        this.logger = logger;
        this.metrics = new Map();
        this.timers = new Map();
    }

    startTimer(name) {
        this.timers.set(name, performance.now());
    }

    endTimer(name) {
        const startTime = this.timers.get(name);
        if (!startTime) {
            this.logger.warn(`Timer '${name}' was not started`);
            return;
        }

        const duration = performance.now() - startTime;
        this.timers.delete(name);

        this.recordMetric(name, duration);
        return duration;
    }

    recordMetric(name, value) {
        if (!this.metrics.has(name)) {
            this.metrics.set(name, {
                count: 0,
                total: 0,
                min: Infinity,
                max: -Infinity,
                average: 0
            });
        }

        const metric = this.metrics.get(name);
        metric.count++;
        metric.total += value;
        metric.min = Math.min(metric.min, value);
        metric.max = Math.max(metric.max, value);
        metric.average = metric.total / metric.count;

        this.logger.debug(`Performance metric: ${name}`, {
            value: value,
            average: metric.average,
            min: metric.min,
            max: metric.max
        });
    }

    getMetric(name) {
        return this.metrics.get(name);
    }

    getAllMetrics() {
        const result = {};
        this.metrics.forEach((value, key) => {
            result[key] = { ...value };
        });
        return result;
    }

    clearMetrics() {
        this.metrics.clear();
        this.timers.clear();
    }
}

// Create singleton instances
export const logger = new Logger('Game');
export const errorHandler = new ErrorHandler(logger);
export const performanceMonitor = new PerformanceMonitor(logger);

// Convenience functions
export function createLogger(name) {
    return logger.child(name);
}

export function logError(message, error) {
    logger.error(message, {
        message: error.message,
        stack: error.stack,
        ...error
    });
}

export function logPerformance(name, fn) {
    performanceMonitor.startTimer(name);
    const result = fn();
    performanceMonitor.endTimer(name);
    return result;
}

export async function logPerformanceAsync(name, fn) {
    performanceMonitor.startTimer(name);
    const result = await fn();
    performanceMonitor.endTimer(name);
    return result;
}