import { z } from 'zod';

export const passwordPolicyMessages = {
  minLength: 'Password must be at least 8 characters',
  uppercase: 'Password must contain at least one uppercase letter',
  number: 'Password must contain at least one number',
  special: 'Password must contain at least one special character',
} as const;

export const passwordSchema = z
  .string()
  .min(8, passwordPolicyMessages.minLength)
  .regex(/[A-Z]/, passwordPolicyMessages.uppercase)
  .regex(/[0-9]/, passwordPolicyMessages.number)
  .regex(/[!@#$%^&*(),.?":{}|<>]/, passwordPolicyMessages.special);

export type PasswordPolicyCheck = {
  key: keyof typeof passwordPolicyMessages;
  message: string;
  met: boolean;
};

export function getPasswordPolicyChecks(password: string): PasswordPolicyCheck[] {
  return [
    {
      key: 'minLength',
      message: passwordPolicyMessages.minLength,
      met: password.length >= 8,
    },
    {
      key: 'uppercase',
      message: passwordPolicyMessages.uppercase,
      met: /[A-Z]/.test(password),
    },
    {
      key: 'number',
      message: passwordPolicyMessages.number,
      met: /[0-9]/.test(password),
    },
    {
      key: 'special',
      message: passwordPolicyMessages.special,
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];
}

export function isPasswordPolicySatisfied(password: string): boolean {
  return getPasswordPolicyChecks(password).every((check) => check.met);
}
