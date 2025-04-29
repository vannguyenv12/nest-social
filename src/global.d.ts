interface IUserPayload {
  _id: string;
  name: string;
  email: string;
}

declare namespace Express {
  export interface Request {
    currentUser: IUserPayload;
  }
}
