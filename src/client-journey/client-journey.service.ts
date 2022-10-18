import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Journey } from 'src/database/journey.entity';
import { User } from 'src/database/user.entity';
import { Vehicle } from 'src/database/vehicle.entity';
import { LocationService } from 'src/location/location.service';
import { ClientSocketsGateway } from 'src/sockets/client-sockets/client-sockets.gateway';
import { TripService } from 'src/trip/trip.service';
import { JourneyStatus } from 'src/utils/enums/jstatus.enum';
import { Repository } from 'typeorm';

@Injectable()
export class ClientJourneyService {
  constructor(
    @InjectRepository(Journey) private journeyRep: Repository<Journey>,
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
    private readonly tripSer: TripService,
    private socket: ClientSocketsGateway,
    private locationService: LocationService,
  ) {}
  // @InjectRepository(Trip) private readonly tripRepo: Repository<Trip>,

  async create(data: any, user, dest: any, origin: any) {
    const arrival = await this.locationService.findOne(dest.code);
    const departure = await this.locationService.findOne(origin.code);

    const trip = await this.tripSer.find(departure, arrival);

    const temp = await this.journeyRep.create({
      origin: origin,
      destination: dest,
      // owner: user,
      wage: trip.price,
    });

    // return { departure, arrival , trip };
    // return trip;
    const journey = await this.journeyRep.save(temp);
    journey.save();
    // await this.socket.sendToDrivers(journey);
    return journey;
  }

  async findJourneys(user: User) {
    const journeys = await this.journeyRep.find({
      where: {
        owner: user,
        status: JourneyStatus.NEW,
      },
      relations: ['shipments', 'origin', 'destination'],
    });

    return { journeys: journeys };
  }

  //Show Journey When Accepted
  // Edit to : Show Shipment Journey when accepted
  ///  driver [Driver] accepted to pick your [Shipment 'trackNo'] .. and  [Journey 'uuid'] .. [Vehcile 'uuid'].. thanks
  async showJourney(journeyUuid: string, user: User) {
    const journey = await this.journeyRep.findOne({
      where: {
        // owner: user,
        uuid: journeyUuid,
      },
      relations: ['vehicle', 'destination', 'origin'],
      // relations: ['vehicle'],
    });
    const vehicle = journey.vehicle;
    const origin = journey.origin;
    // const destination = journey.destination;
    // const trip = journey.trip

    return vehicle;
    // return origin;
    // return {
    //   journey: journey,
    // };
  }
  async payment(file: Express.Multer.File) {
    const fName = await file.originalname;
    return fName;
  }
}
