interface IUserPayload {
  _id: string;
  name: string;
  email: string;
  role: string;
}

declare namespace Express {
  export interface Request {
    currentUser: IUserPayload;
  }
}
