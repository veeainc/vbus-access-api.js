/**
 * Just a basic logger adapter to reuse code from vbus.js.
 */
class LoggerAdapter {
    warn(format: string, ...args: any[]) {
        console.warn(format, ...args)
    }

    trace(format: string, ...args: any[]) {
        console.trace(format, ...args)
    }

    debug(format: string, ...args: any[]) {
        console.log(format, ...args)
    }
}

export function getLogger(): LoggerAdapter {
    return new LoggerAdapter()
}
