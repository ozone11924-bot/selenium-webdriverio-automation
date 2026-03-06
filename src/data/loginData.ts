export interface LoginCredentials {
  description: string;
  username: string;
  password: string;
  expectedOutcome: 'success' | 'failure';
  expectedMessageContains: string;
}

export const loginData: LoginCredentials[] = [
  { description: 'valid credentials', username: 'tomsmith', password: 'SuperSecretPassword!', expectedOutcome: 'success', expectedMessageContains: 'You logged into a secure area!' },
  { description: 'invalid username', username: 'wronguser', password: 'SuperSecretPassword!', expectedOutcome: 'failure', expectedMessageContains: 'Your username is invalid!' },
  { description: 'invalid password', username: 'tomsmith', password: 'wrongpassword', expectedOutcome: 'failure', expectedMessageContains: 'Your password is invalid!' },
  { description: 'empty username', username: '', password: 'SuperSecretPassword!', expectedOutcome: 'failure', expectedMessageContains: 'Your username is invalid!' },
  { description: 'empty password', username: 'tomsmith', password: '', expectedOutcome: 'failure', expectedMessageContains: 'Your password is invalid!' },
];

export const validUser = { username: 'tomsmith', password: 'SuperSecretPassword!' };