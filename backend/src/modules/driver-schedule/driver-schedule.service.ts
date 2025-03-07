import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { DRIVERSCHEDULE_GATEWAY, DRIVERSCHEDULE_REPOSITORY } from "src/modules/driver-schedule/driver-schedule.di-token";
import { ICreateDriverSchedule, IUpdateDriverSchedule } from "src/modules/driver-schedule/driver-schedule.dto";
import { DriverScheduleGateway } from "src/modules/driver-schedule/driver-schedule.gateway";
import { IDriverScheduleRepository, IDriverScheduleService } from "src/modules/driver-schedule/driver-schedule.port";
import { DriverScheduleDocument } from "src/modules/driver-schedule/driver-schedule.schema";
import { USER_REPOSITORY } from "src/modules/users/users.di-token";
import { IUserRepository } from "src/modules/users/users.port";
import { VEHICLE_REPOSITORY } from "src/modules/vehicles/vehicles.di-token";
import { IVehiclesRepository } from "src/modules/vehicles/vehicles.port";
import { DriverSchedulesStatus, Shift, ShiftDifference, ShiftHours, UserRole, UserStatus } from "src/share/enums";
import { VehicleCondition, VehicleOperationStatus } from "src/share/enums/vehicle.enum";


@Injectable()
export class DriverScheduleService implements IDriverScheduleService {
  constructor(
    @Inject(DRIVERSCHEDULE_REPOSITORY)
    private readonly driverScheduleRepository: IDriverScheduleRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: IVehiclesRepository,
    @Inject(DRIVERSCHEDULE_GATEWAY)
    private readonly driverScheduleGateway: DriverScheduleGateway,


  ) { }


  async createListDriverSchedule(driverSchedules: ICreateDriverSchedule[]): Promise<DriverScheduleDocument[]> {
    const newDriverSchedules = [];
    //check if driverSchedule of driverSchedules is have same 
    await this.checkListDriverSchedule(driverSchedules);
    for (const driverSchedule of driverSchedules) {
      const newDriverSchedule = await this.driverScheduleRepository.createDriverSchedule(driverSchedule);
      newDriverSchedules.push(newDriverSchedule);
    }
    return newDriverSchedules;
  }

  async checkListDriverSchedule(driverSchedules: ICreateDriverSchedule[]): Promise<boolean> {
    // check not have same date and shift in array and in database
    for (const schedule of driverSchedules) {
      console.log('schedule.driver', schedule.driver)
      const driver = await this.userRepository.getUserById(schedule.driver, ['status', 'role', 'name']);
      console.log('driver', driver);
      if (driver.status !== UserStatus.ACTIVE || !driver || driver.role !== UserRole.DRIVER) {
        throw new HttpException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Driver ${driver.name} is not active`,
          vnMessage: `Tài xế ${driver.name} không sẵn sàng`
        }, HttpStatus.BAD_REQUEST);
      }

      const vehicle = await this.vehicleRepository.getById(schedule.vehicle);
      if (!vehicle) {
        throw new HttpException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Vehicle ${schedule.vehicle} not found`,
          vnMessage: `Không tìm thấy xe ${schedule.vehicle}`

        }, HttpStatus.BAD_REQUEST);
      }
      if (vehicle.vehicleCondition !== VehicleCondition.AVAILABLE) {
        throw new HttpException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Vehicle ${schedule.vehicle} is not available`,
          vnMessage: `Xe ${schedule.vehicle} không sẵn sàng`
        }, HttpStatus.BAD_REQUEST);
      }

      const isExistScheduleWithDriver = await this.driverScheduleRepository.findOneDriverSchedule({
        date: schedule.date,
        driver: schedule.driver
      }, []
      );
      if (isExistScheduleWithDriver) {
        throw new HttpException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Duplicate date shift with driver ${schedule.date}-${schedule.driver} in database`,
          vnMessage: `Trùng lịch ${schedule.date}-${schedule.driver}`
        }, HttpStatus.BAD_REQUEST);
      }

      const isExistScheduleWithVehicle = await this.driverScheduleRepository.findOneDriverSchedule({
        date: schedule.date,
        vehicle: schedule.vehicle
      }, []
      );
      if (isExistScheduleWithVehicle) {
        throw new HttpException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Duplicate date shift with vehicle ${schedule.date}-${schedule.vehicle} in database`,
          vnMessage: `Trùng lịch ${schedule.date}-${schedule.vehicle}`
        }, HttpStatus.BAD_REQUEST);
      }
    }

    const seen = new Set<string>();
    for (const schedule of driverSchedules) {
      console.log(schedule.date);
      const keyWithDriver = `${schedule.date}-${schedule.driver}`;
      const keyWithVehicle = `${schedule.date}-${schedule.vehicle}`;
      if (seen.has(keyWithDriver)) {
        throw new HttpException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Duplicate date shift with driver ${keyWithDriver} in list`,
          vnMessage: `Trùng lịch ${keyWithDriver}`
        }, HttpStatus.BAD_REQUEST);
      }
      if (seen.has(keyWithVehicle)) {
        throw new HttpException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Duplicate date shift with vehicle  ${keyWithVehicle} in list`,
          vnMessage: `Trùng lịch ${keyWithVehicle}`
        }, HttpStatus.BAD_REQUEST);
      }
      seen.add(keyWithDriver)
      seen.add(keyWithVehicle)
    }

    return true;
  }

  async createDriverSchedule(driverSchedule: ICreateDriverSchedule): Promise<DriverScheduleDocument> {
    const newDriverSchedule = await this.driverScheduleRepository.createDriverSchedule(driverSchedule);
    return newDriverSchedule;
  }

  async getDriverScheduleById(id: string): Promise<DriverScheduleDocument> {
    const driverSchedule = await this.driverScheduleRepository.getDriverScheduleById(id);
    return driverSchedule;
  }

  async getPersonalSchedulesFromStartToEnd(driverId: string, start: Date, end: Date): Promise<DriverScheduleDocument[]> {
    // get all driver schedule from start to end
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new HttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid date',
        vnMessage: `Ngày không hợp lệ`,
      }, HttpStatus.BAD_REQUEST);
    }
    const schedules = await this.driverScheduleRepository.getDriverSchedules({
      driver: driverId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }, []);
    return schedules;
  }

  async getAllDriverSchedules(): Promise<DriverScheduleDocument[]> {
    const driverSchedules = await this.driverScheduleRepository.getAllDriverSchedules();
    return driverSchedules;
  }

  async getScheduleFromStartToEnd(start: Date, end: Date): Promise<DriverScheduleDocument[]> {
    // get all driver schedule from start to end
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new HttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid date',
        vnMessage: `Ngày không hợp lệ`,
      }, HttpStatus.BAD_REQUEST);
    }
    const schedules = await this.driverScheduleRepository.getDriverSchedules({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }, []);
    return schedules;
  }

  async getDriverSchedules(query: any): Promise<DriverScheduleDocument[]> {
    const driverSchedules = await this.driverScheduleRepository.getDriverSchedules(query, []);
    return driverSchedules;
  }

  async updateDriverSchedule(id: string, driverSchedule: IUpdateDriverSchedule): Promise<DriverScheduleDocument> {
    const updatedDriverSchedule = await this.driverScheduleRepository.updateDriverSchedule(id, driverSchedule);
    return updatedDriverSchedule;
  }


  async driverCheckIn(driverScheduleId: string, driverId: string): Promise<DriverScheduleDocument> {
    // get current time,
    const currentTime = new Date();
    console.log('driverScheduleId', driverScheduleId)
    const driverSchedule = await
      this.driverScheduleRepository.findOneDriverSchedule(
        {
          _id: driverScheduleId,
          driver: driverId
        }, []);
    if (!driverSchedule) {
      throw new HttpException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Driver Schedule not found',
        vnMessage: `Không tìm thấy lịch`,
      }, HttpStatus.NOT_FOUND);
    }
    if (driverSchedule.status !== DriverSchedulesStatus.NOT_STARTED) {
      throw new HttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Driver schedule has started or completed',
        vnMessage: 'Đã chấm công',
      }, HttpStatus.BAD_REQUEST);
    }
    const shift = driverSchedule.shift;
    const shiftHours = ShiftHours[shift];

    const expectedCheckin = new Date(driverSchedule.date);
    expectedCheckin.setHours(shiftHours.start, ShiftDifference.IN, 0, 0);

    const expectedCheckout = new Date(driverSchedule.date);
    expectedCheckout.setHours(shiftHours.end, ShiftDifference.OUT, 0, 0);

    console.log('shiftHours', shiftHours)
    console.log('expectedCheckin', expectedCheckin)
    console.log('expectedCheckout', expectedCheckout)
    console.log('currentTime', currentTime)

    if (currentTime < expectedCheckin || currentTime > expectedCheckout) {
      throw new HttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Driver schedule is not in shift time',
        vnMessage: 'Không trong ca làm',
      }, HttpStatus.BAD_REQUEST);
    }

    await this.vehicleRepository.updateOperationStatus(
      driverSchedule.vehicle._id.toString(),
      VehicleOperationStatus.RUNNING
    )

    driverSchedule.status = DriverSchedulesStatus.IN_PROGRESS;
    driverSchedule.checkinTime = currentTime;
    if (currentTime.getTime() > expectedCheckin.getTime() - ShiftDifference.IN) {
      driverSchedule.isLate = true
    }

    const scheduleUpdate = await this.driverScheduleRepository.updateDriverSchedule(
      driverScheduleId,
      {
        status: driverSchedule.status,
        checkinTime: driverSchedule.checkinTime,
        isLate: driverSchedule.isLate
      }
    );


    await this.driverScheduleGateway.handleDriverCheckin(driverId, scheduleUpdate.vehicle.toString());
    return scheduleUpdate;
  }

  async driverCheckOut(driverScheduleId: string, driverId: string): Promise<DriverScheduleDocument> {
    const currentTime = new Date();
    const driverSchedule = await
      this.driverScheduleRepository.findOneDriverSchedule(
        {
          _id: driverScheduleId,
          driver: driverId
        }, []);
    if (!driverSchedule) {
      throw new HttpException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Driver Schedule not found',
        vnMessage: `Không tìm thấy lịch`,
      }, HttpStatus.NOT_FOUND);
    }
    // Validate schedule status
    if (driverSchedule.status !== DriverSchedulesStatus.IN_PROGRESS) {
      throw new HttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Schedule must be in progress to checkout',
        vnMessage: 'Không thể kết ca',
      }, HttpStatus.BAD_REQUEST);
    }
    await this.vehicleRepository.updateOperationStatus(
      driverSchedule.vehicle._id.toString(),
      VehicleOperationStatus.PENDING
    )

    // Calculate expected checkout time
    const shift = driverSchedule.shift as Shift;
    const shiftEndHour = ShiftHours[shift].end;
    const expectedCheckout = new Date(driverSchedule.date);
    expectedCheckout.setHours(shiftEndHour, 0, 0, 0);

    // Validate checkout time
    if (currentTime < expectedCheckout) {
      driverSchedule.isEarlyCheckout = true;
    }

    // Update schedule
    driverSchedule.status = DriverSchedulesStatus.COMPLETED;
    driverSchedule.checkoutTime = currentTime;

    const scheduleUpdate = await this.driverScheduleRepository.updateDriverSchedule(
      driverScheduleId,
      {
        status: driverSchedule.status,
        checkoutTime: driverSchedule.checkoutTime,
        isEarlyCheckout: driverSchedule.isEarlyCheckout
      }
    );

    await this.driverScheduleGateway.handleDriverCheckout(driverId);

    return scheduleUpdate
  }

  async autoCheckoutPendingSchedules() {
    const currentTime = new Date();

    // Lấy tất cả các ca đang trong trạng thái IN_PROGRESS
    const pendingSchedules = await this.driverScheduleRepository.getDriverSchedules({
      status: DriverSchedulesStatus.IN_PROGRESS,
    }, []);

    for (const schedule of pendingSchedules) {
      const shift = schedule.shift as Shift;
      const shiftEndHour = ShiftHours[shift].end;
      const expectedCheckout = new Date(schedule.date);
      expectedCheckout.setHours(shiftEndHour, 0, 0, 0);

      // Nếu thời gian hiện tại đã qua thời gian expectedCheckout, thực hiện checkout
      if (currentTime > expectedCheckout) {
        await this.vehicleRepository.updateOperationStatus(
          schedule.vehicle._id.toString(),
          VehicleOperationStatus.PENDING
        );

        schedule.status = DriverSchedulesStatus.COMPLETED;
        schedule.checkoutTime = currentTime;
        schedule.isEarlyCheckout = false; // Không phải là checkout sớm vì đã quá giờ

        await this.driverScheduleRepository.updateDriverSchedule(
          schedule._id.toString(),
          {
            status: schedule.status,
            checkoutTime: schedule.checkoutTime,
            isEarlyCheckout: schedule.isEarlyCheckout,
          });

        await this.driverScheduleGateway.handleDriverCheckout(schedule.driver._id.toString());

        console.log(`Auto checkout for schedule ${schedule._id} completed.`);
      }
    }
  }
}