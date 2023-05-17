import { User } from '../user';

export interface NewUser extends User {
  password: string;
  confirmPassword: string;
}
