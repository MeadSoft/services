// service name
export const SERVICE_NAME = 'iam';

// local username/password auth
export const MIN_PASSWORD_LENGTH = 8;

// cookie auth
export const IAM_COOKIE_NAME = `meadsoft.${SERVICE_NAME}.jwt`;
export const COOKIE_AUTH_SECURE_DEFAULT = true;
export const COOKIE_AUTH_SAME_SITE_DEFAULT = 'lax';
export const COOKIE_AUTH_MINIMUM_MAX_AGE_MILLISECONDS = 1;
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const COOKIE_AUTH_MAX_AGE_MILLISECONDS_DEFAULT = 7 * 24 * 60 * 60 * 1000; // 7 days
