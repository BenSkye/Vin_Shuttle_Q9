import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { DriverSchedulesStatus, Shift } from 'src/share/enums';

export type DriverScheduleDocument = HydratedDocument<DriverSchedule>;

@Schema({ collection: 'DriverSchedules', timestamps: true })
export class DriverSchedule {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  driver: Types.ObjectId;

  @Prop({ type: Date, required: true })
  date: Date; // Ngày làm việc (ví dụ: 2023-10-01)

  @Prop({ type: String, enum: Shift, required: true })
  shift: string; // Ca làm việc (A, B, C, D)

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: String, enum: DriverSchedulesStatus, default: DriverSchedulesStatus.NOT_STARTED })
  status: string;

  @Prop({ type: Date })
  checkinTime: Date; // Thời gian checkin

  @Prop({ type: Date })
  checkoutTime: Date; // Thời gian checkout

  @Prop({ type: Boolean, default: false })
  isLate: boolean; // Đánh dấu tài xế checkin trễ

  @Prop({ type: Boolean, default: false })
  isEarlyCheckout: boolean; // Đánh dấu tài xế checkout sớm
}

export const DriverScheduleSchema = SchemaFactory.createForClass(DriverSchedule);
