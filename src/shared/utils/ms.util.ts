type Unit =
    | 'Years' | 'Year' | 'Yrs' | 'Yr' | 'Y'
    | 'Weeks' | 'Week' | 'Wks' | 'Wk' | 'W'
    | 'Days' | 'Day' | 'Dys' | 'Dy' | 'D'
    | 'Hours' | 'Hour' | 'Hrs' | 'Hr' | 'H'
    | 'Minutes' | 'Minute' | 'Mins' | 'Min' | 'M'
    | 'Seconds' | 'Second' | 'Secs' | 'Sec' | 'S'
    | 'Milliseconds' | 'Millisecond' | 'Msecs' | 'Msec' | 'Ms';

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

export type StringValue = `${number}${UnitAnyCase}` | `${number} ${UnitAnyCase}` | `${number}`;

export function ms(duration: StringValue): number {
    // Handle plain numbers (assume milliseconds)
    const plainNumber = /^(\d+(?:\.\d+)?)$/.exec(duration);
    if (plainNumber) {
        return parseFloat(plainNumber[1]);
    }

    // Parse duration with unit
    const match = /^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)s?$/.exec(duration);
    if (!match) {
        throw new Error(`Invalid duration format: ${duration}`);
    }

    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();

    // Convert to milliseconds based on unit
    switch (unit) {
        // Years
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
            return value * 365.25 * 24 * 60 * 60 * 1000;

        // Weeks
        case 'weeks':
        case 'week':
        case 'wks':
        case 'wk':
        case 'w':
            return value * 7 * 24 * 60 * 60 * 1000;

        // Days
        case 'days':
        case 'day':
        case 'dys':
        case 'dy':
        case 'd':
            return value * 24 * 60 * 60 * 1000;

        // Hours
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
            return value * 60 * 60 * 1000;

        // Minutes
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
            return value * 60 * 1000;

        // Seconds
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
            return value * 1000;

        // Milliseconds
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
            return value;

        default:
            throw new Error(`Unknown unit: ${unit}`);
    }
}
