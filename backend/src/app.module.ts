import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehicleCategoryModule } from './modules/vehicle-categories/vehicle-category.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongodbConfig from 'src/config/mongodb.config';
import { MongooseModule } from '@nestjs/mongoose';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { KeytokenModule } from 'src/modules/keytoken/keytoken.module';
import { OtpModule } from 'src/modules/OTP/otp.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { ScenicRouteModule } from 'src/modules/scenic-route/scenic-route.module';
import { AppGateway } from 'src/app.gateway';
import { DriverScheduleModule } from 'src/modules/driver-schedule/driver-schedule.module';
import { TripModule } from 'src/modules/trip/trip.module';
import { BookingModule } from 'src/modules/booking/booking.module';
import { SearchModule } from 'src/modules/search/search.module';
import { CheckoutModule } from 'src/modules/checkout/checkout.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mongodbConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
        dbName: configService.get<string>('mongodb.database'),
      }),
      inject: [ConfigService],
    }),
    VehicleCategoryModule,
    VehiclesModule,
    UsersModule,
    AuthModule,
    KeytokenModule,
    OtpModule,
    PricingModule,
    ScenicRouteModule,
    DriverScheduleModule,
    TripModule,
    SearchModule,
    BookingModule,
    CheckoutModule
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule { }
