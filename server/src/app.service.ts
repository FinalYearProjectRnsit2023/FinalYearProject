import { Injectable } from '@nestjs/common';

import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AppService {
  private readonly supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_RLS,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  getHello() {
    return {};
  }

  getSupabase() {
    this.supabase.auth.admin;
    return this.supabase;
  }
}
