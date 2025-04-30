interface IUserPayload {
  _id: string;
  name: string;
  email: string;
  role: string;
}

type IRole = 'user' | 'admin';
type IPrivacy = 'public' | 'private' | 'friends';

declare namespace Express {
  export interface Request {
    currentUser: IUserPayload;
  }
}
