import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
const serviceKey = process.env.SUPABASE_RLS as string;

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const adminAuthClient = supabase.auth.admin;

app.get("/", async (req: Request, res: Response) => {
  // const { data, error } = await adminAuthClient.createUser({
  //   email: "legend@gmail.com",
  //   password: "Legend",
  //   email_confirm: true,
  //   user_metadata: {
  //     firstName: "Legend",
  //     middleName: "",
  //     lastName: "Never_Dies",
  //     DOB: new Date("28/12/2001"),
  //   },
  // });

  // console.log({ data, error });

  // {
  //   data: {
  //     user: {
  //       id: '328b37e6-7d60-4de9-95cf-fcd497c5714b',
  //       aud: 'authenticated',
  //       role: 'authenticated',
  //       email: 'legend@gmail.com',
  //       email_confirmed_at: '2023-03-07T17:44:08.318558512Z',
  //       phone: '',
  //       app_metadata: [Object],
  //       user_metadata: [Object],
  //       identities: null,
  //       created_at: '2023-03-07T17:44:08.314657Z',
  //       updated_at: '2023-03-07T17:44:08.318758Z'
  //     }
  //   },
  //   error: null
  // }

  res.send("Express + TypeScript Server");
});

app.post("/regester", async (req: Request, res: Response) => {
  //
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
