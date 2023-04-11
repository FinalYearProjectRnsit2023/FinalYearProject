/* eslint-disable no-var */
import { AppService } from 'src/app.service';
import { Injectable } from '@nestjs/common';
import { UUID } from './User.Model';

@Injectable()
export class UserService {
  async CheckUserRegister(registerRequest: UUID, appService: AppService) {
    const supabase = await appService.getSupabase();

    var { data, error } = await supabase
      .from('User')
      .select('*')
      .filter('id', 'eq', registerRequest.Id);

    if (error) {
      return { error };
    }

    if (data.length > 0) {
      const dat = data[0];

      var { data, error } = await supabase
        .from('UserFingerPrint')
        .select('*')
        .filter('userId', 'eq', data[0].id);

      if (data.length > 0) {
        return {
          Id: dat.id,
          IsRegistered: true,
          Fingerprint: true,
        };
      } else {
        return {
          Id: dat.id,
          IsRegistered: true,
          Fingerprint: false,
        };
      }
    }
    return { error: 'The user Dosent Exist' };
  }

  async IsLogined(userId: UUID, appService: AppService) {
    const supabase = appService.getSupabase();

    const registered = await this.CheckUserRegister(userId, appService);

    if (registered.error) {
      return { error: registered.error };
    }

    //! `|| true` should be removed when fingerprint is added
    if (registered.Fingerprint == true || true) {
      const { data, error } = (await supabase
        .from('Login')
        .select('*')
        .eq('UserId', userId.Id)
        .is('Logout', null)) as {
        data: any[];
        error: any;
      };

      if (error) {
        return { error };
      }

      if (data.length > 0) {
        return {
          Logined: true,
        };
      } else {
        return {
          Logined: false,
        };
      }
    } else {
      return {
        error: 'The Fingerprint is required to complete the registration',
      };
    }
  }

  async IsTeacher(teacherId: UUID, appService: AppService) {
    const supabase = appService.getSupabase();

    const isLogined = await this.IsLogined(teacherId, appService);

    if (isLogined.error) {
      return {
        error: isLogined.error,
      };
    }

    if (isLogined.Logined) {
      const { data, error } = await supabase
        .from('Teachers')
        .select('*')
        .filter('id', 'eq', teacherId.Id);

      if (error) {
        return { error };
      }

      if (data.length > 0) {
        return { val: true };
      } else {
        return { val: false };
      }
    } else {
      return {
        error: 'the user is not logined in',
      };
    }
  }

  async IsStudent(studentId: UUID, appService: AppService) {
    const supabase = appService.getSupabase();

    const isLogined = await this.IsLogined(studentId, appService);

    if (isLogined.error) {
      return {
        error: isLogined.error,
      };
    }

    if (isLogined.Logined) {
      const { data, error } = await supabase
        .from('Students')
        .select('*')
        .filter('id', 'eq', studentId.Id);

      if (error) {
        return { error };
      }

      if (data.length > 0) {
        return { val: true };
      } else {
        return { val: false };
      }
    } else {
      return {
        error: 'the user is not logined in',
      };
    }
  }
}
