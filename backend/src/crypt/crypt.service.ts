import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class CryptService {
  async encode(password: string) {
    return bcrypt.hash(password, 10);
  }

  async decode(first: string, second: string) {
    return await bcrypt.compare(first, second);
  }
}
