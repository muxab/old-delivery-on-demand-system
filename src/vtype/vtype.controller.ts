import { Controller } from '@nestjs/common';
import { VtypeService } from './vtype.service';

@Controller('vtype')
export class VtypeController {
  constructor(private readonly vtypeService: VtypeService) {}
}
