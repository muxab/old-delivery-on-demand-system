import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Journey } from 'src/database/journey.entity';
import { Shipment } from 'src/database/shipment.entity';
import { User } from 'src/database/user.entity';
import { VehicleType } from 'src/database/vehicle-type.entity';
import { Vehicle } from 'src/database/vehicle.entity';
import { LocationService } from 'src/location/location.service';
import { TripService } from 'src/trip/trip.service';
import { JourneyStatus } from 'src/utils/enums/jstatus.enum';
import { Status } from 'src/utils/enums/vstatus.enum';
import { GloabalService } from 'src/utils/extra/global.service';
import { Repository } from 'typeorm';

@Injectable()
export class JourneyService {
  constructor(
    @InjectRepository(Journey) private journeyRep: Repository<Journey>,
    @InjectRepository(Vehicle) private vehicleRep: Repository<Vehicle>,
    private locationService: LocationService,
    private readonly tripSer: TripService,
    private uniqueId: GloabalService,

  ) { }


  async createJourney(dest: any, origin: any, shipment: Shipment): Promise<Journey> {

    const arrival = await this.locationService.findOne(dest.code);
    const departure = await this.locationService.findOne(origin.code);

    const trip = await this.tripSer.find(departure, arrival);

    //trackNo
    const trackNo = await this.generateTrackNo(

      dest.code == null ? 'unknown' : dest.code,
      origin.code == null ? 'unknown' : origin.code,

    );

    const tempa_data = this.journeyRep.create({
      origin: origin,
      destination: dest,
      // wage: trip.price, // Deleted Due To Disagree of prices definition
      shipments: [shipment],
      dest_address: shipment.dest_address,
      origin_address: shipment.origin_address,
      track_no: trackNo,
    });

    const journeny = this.journeyRep.save(tempa_data);

    return journeny;
  }

  async findOne(uuid: string): Promise<any> {
    const journeny = await this.journeyRep.findOne({
      where: { uuid: uuid },
      // relations: ['driver', 'oldDriver'],
      relations: ['shipments', 'vehicle', 'origin', 'destination'],
    });
    return { journey: journeny };
  }

  async findJourneys(user: User): Promise<Journey[]> {
    const journeys = await this.journeyRep.find({
      where: {

        status: JourneyStatus.NEW,
      },
      relations: ['shipments'],
    });

    return journeys;
  }

  //Show Journey When Accepted
  async showJourney(journeyUuid: string, user: User): Promise<any> {
    const journey = await this.journeyRep.findOne({
      where: {
        owner: user,
        uuid: journeyUuid,
      },
      relations: ['vehicle', 'destination', 'origin'],
    });
    const vehicle = journey.vehicle;

    return {
      journey: journey,
      vehicle: vehicle,
    };
  }


  async updateJourney(uuid: any, v_uuid: any) {

    const journey = await this.journeyRep.findOne({
      where: [
        { id: uuid },
        { uuid: uuid, },
        { track_no: uuid, },
      ],
      relations: ['vehicle'],
    });

    const vehicle = await this.vehicleRep.findOne({
      where: [
        { id: v_uuid },
        { uuid: v_uuid },
        { liceinse_no: v_uuid },
      ],
      relations: ['current'],
    });

    journey.vehicle = vehicle;
    journey.status = JourneyStatus.PICKING;
    await this.journeyRep.save(journey);
    vehicle.currentId = journey.id;
    vehicle.status = Status.PICKING;
    await this.vehicleRep.save(vehicle);

    return journey;

  }



  /// Track No Generation
  async generateTrackNo(dest, origin) {

    const trakNo = await this.uniqueId.uniqueNumber(dest, origin);
    const result = await this.journeyRep.find({
      where: {
        track_no: trakNo,
      },
    });
    while (result.length > 0) {
      await this.journeyRep.find({
        where: {
          track_no: trakNo,
        },
      });
      return await this.uniqueId.uniqueNumber(dest, origin);
    }
    return trakNo;
  }
}
