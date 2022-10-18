import { Test, TestingModule } from '@nestjs/testing';
import { OushiService } from './oushi.service';

describe('OushiService', () => {
  let service: OushiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OushiService],
    }).compile();

    service = module.get<OushiService>(OushiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
