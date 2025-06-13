export interface LocationMetadata {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
}

export interface DeviceMetadata {
    browser: string;
    os: string;
    type: string;
    ip: string;
    userAgent: string;
}

export interface SessionMetadata {
    location: LocationMetadata;
    device: DeviceMetadata;
    ip: string;
}