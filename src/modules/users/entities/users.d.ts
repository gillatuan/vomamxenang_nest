export interface IUser {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: {
      _id: string;
      name: string;
  };
  permissions?: {
      _id: string;
      name: string;
      module: string;
  }[]
}
