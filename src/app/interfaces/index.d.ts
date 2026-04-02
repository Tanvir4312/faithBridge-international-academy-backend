import { IRequestUser } from "./requestUser.inteface";

declare global {
  namespace Express {
    interface Request {
      user: IRequestUser;
    }
  }
}
