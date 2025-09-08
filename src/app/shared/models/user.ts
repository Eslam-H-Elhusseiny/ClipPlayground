export interface Login {
  email: string;
  password: string;
}
export interface User extends Login {
  name: string;
  confirmPassword: string;
  age?: number;
}
