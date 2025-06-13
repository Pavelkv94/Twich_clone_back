import { DeviceMetadata, LocationMetadata, SessionMetadata } from "@/src/shared/types/session-metadata.types";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class LocationModel implements LocationMetadata {
    @Field(() => String)
    country: string;

    @Field(() => String)
    city: string;

    @Field(() => Number)
    latitude: number;

    @Field(() => Number)
    longitude: number;
}

@ObjectType()
export class DeviceModel implements DeviceMetadata {
    @Field(() => String)
    browser: string;

    @Field(() => String)
    os: string;

    @Field(() => String)
    type: string;

    @Field(() => String)
    ip: string;

    @Field(() => String)
    userAgent: string;
}

@ObjectType()
export class SessionMetadataModel implements SessionMetadata {
    @Field(() => LocationModel)
    location: LocationModel;

    @Field(() => DeviceModel)
    device: DeviceModel;

    @Field(() => String)
    ip: string;
}


@ObjectType()
export class SessionModel {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    createdAt: string;

    @Field(() => String)
    userId: string;

    @Field(() => SessionMetadataModel)
    metadata: SessionMetadataModel;
}