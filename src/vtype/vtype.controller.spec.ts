import { Test, TestingModule } from '@nestjs/testing';
import { VtypeController } from './vtype.controller';
import { VtypeService } from './vtype.service';

describe('VtypeController', () => {
  let controller: VtypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VtypeController],
      providers: [VtypeService],
    }).compile();

    controller = module.get<VtypeController>(VtypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
