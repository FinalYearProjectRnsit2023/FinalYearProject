import { Controller } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { AttdenceService } from './Attdence.service';

@Controller('')
export class AttdenceController {
  constructor(
    private readonly appService: AppService,
    private readonly attdenceService: AttdenceService,
  ) {}
}
