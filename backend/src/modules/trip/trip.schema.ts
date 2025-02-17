import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ServiceType } from 'src/share/enums';
import { TripStatus } from 'src/share/enums/trip.enum';

export type TripDocument = Trip & Document;

@Schema({ timestamps: true })
export class Trip {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    customerId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    driverId: Types.ObjectId;

    @Prop({ type: Date, required: true })
    timeStart: Date;

    @Prop({ type: Date })
    timeEnd: Date;

    @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
    vehicleId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'DriverSchedule', required: true })
    scheduleId: Types.ObjectId;

    @Prop({
        type: String,
        enum: ServiceType,
        required: true
    })
    serviceType: ServiceType;

    @Prop({
        type: {
            bookingHour: {
                totalTime: Number, // in minutes
                startPoint: String,
            },
            bookingTrip: {
                routeId: Types.ObjectId,
                startPoint: String,
            },
            bookingDestination: {
                startPoint: String,
                endPoint: String,
            },
            bookingShare: {
                numberOfSeat: Number,
                startPoint: String,
                endPoint: String,
            }
        },
        required: true
    })
    servicePayload: {
        bookingHour?: {
            totalTime: number;
            startPoint: string;
        };
        bookingTrip?: {
            routeId: Types.ObjectId;
            startPoint: string;
        };
        bookingDestination?: {
            startPoint: string;
            endPoint: string;
        };
        bookingShare?: {
            numberOfSeat: number;
            startPoint: string;
            endPoint: string;
        };
    };

    @Prop({
        type: String,
        enum: TripStatus,
        default: TripStatus.BOOKING
    })
    status: TripStatus;

    // Indexes for frequent queries
    @Prop({ index: true })
    createdAt: Date;

    @Prop({ index: true })
    updatedAt: Date;
}

export const TripSchema = SchemaFactory.createForClass(Trip);

// Add validation middleware
TripSchema.pre<Trip>('validate', function (next) {
    const serviceType = this.serviceType;
    const payload = this.servicePayload;

    const validators = {
        [ServiceType.BOOKING_HOUR]: () => {
            if (!payload.bookingHour) return false;
            return payload.bookingHour.totalTime && payload.bookingHour.startPoint;
        },
        [ServiceType.BOOKING_TRIP]: () => {
            if (!payload.bookingTrip) return false;
            return payload.bookingTrip.routeId && payload.bookingTrip.startPoint;
        },
        [ServiceType.BOOKING_DESTINATION]: () => {
            if (!payload.bookingDestination) return false;
            return payload.bookingDestination.startPoint && payload.bookingDestination.endPoint;
        },
        [ServiceType.BOOKING_SHARE]: () => {
            if (!payload.bookingShare) return false;
            return payload.bookingShare.numberOfSeat &&
                payload.bookingShare.startPoint &&
                payload.bookingShare.endPoint;
        }
    };

    if (!validators[serviceType]?.()) {
        return next(new Error(`Invalid payload for service type ${serviceType}`));
    }

    next();
});
