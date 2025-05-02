interface IUserPayload {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

type IRole = 'user' | 'admin';
type IPrivacy = 'public' | 'private' | 'friends';
type IReactionType = 'like' | 'wow' | 'love' | 'angry' | 'haha' | 'happy';
type IFriendRequestStatus = 'accept' | 'reject' | 'pending';

declare namespace Express {
  export interface Request {
    currentUser: IUserPayload;
  }
}
