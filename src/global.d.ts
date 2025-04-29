interface IUserPayload {
  _id: string;
  name: string;
  email: string;
  role: string;
}

type IRole = 'user' | 'admin';

declare namespace Express {
  export interface Request {
    currentUser: IUserPayload;
  }
}
