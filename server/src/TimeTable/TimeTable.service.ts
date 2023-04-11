import { AppService } from 'src/app.service';
import { Injectable } from '@nestjs/common';
import { UUID } from 'src/User/User.Model';

@Injectable()
export class TimeTableService {
  async GetClassTimeTableId(userId: UUID) {
    // todo: should write a way to get this classTTId from the db insted of hardcoded value
    return '73524326-c6d7-4496-a3e4-925d8fc4d657';
  }
}
