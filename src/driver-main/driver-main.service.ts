import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Journey } from 'src/database/journey.entity';
import { User } from 'src/database/user.entity';
import { Vehicle } from 'src/database/vehicle.entity';
import { JourneyStatus } from 'src/utils/enums/jstatus.enum';
import { Status } from 'src/utils/enums/vstatus.enum';
import { Repository } from 'typeorm';

@Injectable()
export class DriverMainService {
  
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Journey) private journeyRepo: Repository<Journey>,
    @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
  ) { }

  //the journey is currently traveled by driver,,
  async currentJourney(uuid: string, user: any) {
    // return uuid;
    const vehicle = await this.vehicleRepo.findOne({
      where: {
        driver: user,
      },
    });
    const journey = await this.journeyRepo.findOne({
      where: {
        uuid: uuid,
        vehicle: vehicle,
        status: JourneyStatus.ON_VEHICLE,
      },
      relations: ['clients'],
    });
    // return vehicle;

    // return journey;
    return {
      data: {
        journey: journey,
      },
    };
  }

  //get all driver previous and cuurent journeys to make accounting and reports
  async getDriverJourneys(user: any) {
    console.log(user);
    
    const vehicle = await this.vehicleRepo.findOne({ driver: user });
    const journeys = await this.journeyRepo.find({
      where: {
        vehicle: vehicle,
        status: JourneyStatus.ARRIVED,
      },
      relations : ['origin','destination'],
    });
    console.log(vehicle);
    
    return { journeys: journeys };
  }

  //on login to account and while waiting ,,
  //driver can check for journey on his way to pick it or something else
  async vehicleData(user: any) {

    const vehicle = await this.vehicleRepo.findOne({
      where: { driver: user },
      relations: ['type']
    });

    if(vehicle == null || vehicle == undefined){
      return {
        journey : null ,
        vehicle : null,
      };
    }


      const curjourney = vehicle.currentId;
      const journey = await this.journeyRepo.findOne({
        where: {
          id : curjourney,
        },
        relations: ['destination', 'origin'],
      });
    
    if ( journey == null || journey == undefined) {
      return {
        journey : null ,
        vehicle : vehicle,
      };
    
    }
    // return vehicle.current;
    return { journey: journey, vehicle: vehicle };
  }


// update if vehicle is ready or not 
  async updateVStatus(user: any, status: any) {
    const vehicle = await this.vehicleRepo.findOne({
      where: { driver: user },
      relations: ['type']
    });

    if(status == true ){
      vehicle.status = Status.READY; 
    }else {
      vehicle.status = Status.OUT_SER; 
    }
    vehicle.save() ;

    console.log(status);
    
      return vehicle;
  }


  //details of journey got by uuid
  async journeyDetails(uuid: string, user: User) {
    const journey = await this.journeyRepo.findOne({
      where: [
        { uuid: uuid },
        { track_no: uuid },
      ],
      relations: ['shipments', 'origin', 'destination', 'vehicle'],
    });

    if (journey.vehicle.driver != user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return { journey: journey };
  }

  //to Accept journey to driver's vehicle .. if already accepted by another vehicle -- send apology
  async acceptJourney(uuid: string, user: any) {
    const vehicle = await this.vehicleRepo.findOne({ driver: user });
    const journey = await this.journeyRepo.findOne({
      where: {
        status: JourneyStatus.NEW,
      },
    });
    if ((journey.vehicle = null)) {
      journey.vehicle = vehicle;
      journey.save();
      return { journey: journey };
    } else {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  //update journey status when delivering the shipments and journey
  async updateJourney(uuid: string, user: User) {
    const vehicle = await this.vehicleRepo.findOne({ driver: user });
    const journey = await this.journeyRepo.findOne({
      where: {
        uuid: uuid,
        vehicle: vehicle,
      },
      relations: ['clients'],
    });
    if (!journey) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    } else {
      journey.status = JourneyStatus.ARRIVED;
      journey.save();

      //send notification To clients
      return { journey: journey };
    }
  }

  //after picking the shipment -> will update journey status to on_vehicle ,, send shipment clients notification
  async pickJourney(uuid: string, user: any) {
    const vehicle = await this.vehicleRepo.findOne({ driver: user });
    const journey = await this.journeyRepo.findOne({
      where: {
        uuid: uuid,
        vehicle: vehicle,
      },
      relations: ['shipments', 'origin', 'destination'],
    });

    return { journey: journey };
    // const client = journey.clients;
    //send notification To clients
  }
}
