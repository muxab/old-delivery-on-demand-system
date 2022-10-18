import { Test, TestingModule } from '@nestjs/testing';
import { VtypeService } from './vtype.service';

describe('VtypeService', () => {
  let service: VtypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VtypeService],
    }).compile();

    service = module.get<VtypeService>(VtypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
