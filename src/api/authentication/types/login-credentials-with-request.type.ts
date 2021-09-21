import { User } from '../../users';

export interface LoginCredentialsWithRequest extends Request {
  user: User;
}
