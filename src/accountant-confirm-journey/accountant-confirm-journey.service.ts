import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Journey } from 'src/database/journey.entity';
import { GeneralSocketsGateway } from 'src/sockets/general-sockets/general-sockets.gateway';
import { JourneyStatus } from 'src/utils/enums/jstatus.enum';
import { Repository } from 'typeorm';

@Injectable()
export class AccountantConfirmJourneyService {
  constructor(
    @InjectRepository(Journey) private journeyRepo: Repository<Journey>,
    private socket: GeneralSocketsGateway,
  ) {}
  async getDetails(uuid: string) {
    const journey = await this.journeyRepo.findOne({
      where: {
        uuid: uuid,
      },
      relations: ['owner'],
    });
    return { journey: journey };
  }

  async confirmJourney(uuid: string) {
    const journey = await this.journeyRepo.findOne({
      where: {
        uuid: uuid,
      },
      relations: ['owner'],
    });
    (journey.status = JourneyStatus.CONFIRMED), journey.save();
    return journey.status;
  }
  async updateJourney(uuid: string, status: any) {
    const journey = await this.journeyRepo.findOne({
      where: {
        uuid: uuid,
      },
      relations: ['type'],
    });
    switch (status) {
      case 'ready':
        journey.status = JourneyStatus.CONFIRMED;

        const type = journey.type;
        await this.socket.sendToVehicles(journey, type);
        break;
      case 'reject':
        journey.status = JourneyStatus.DECLINED;
        break;
      default:
        return new HttpException({ msg: 'error' }, HttpStatus.NOT_FOUND);
        break;
    }
    journey.save();
    return journey.type.type;
  }
}
