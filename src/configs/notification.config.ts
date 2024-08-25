/**
 * @fileoverview
 * @version
 * @module
 */
import { INotificationConfig } from '../interfaces';

const {
  MAILGEN_PRODUCT_THEME,
  MAILGEN_PRODUCT_NAME,
  MAILGEN_PRODUCT_LINK,
  MAILGEN_PRODUCT_LOGO,
  MAILGEN_PRODUCT_COPYRIGHT,
  NODEMAILER_SERVICE,
  NODEMAILER_PORT,
  NODEMAILER_HOST,
  NODEMAILER_USERNAME,
  NODEMAILER_PASSWORD,
} = process.env;

export const notificationConfig: INotificationConfig = {
  mailgen: {
    theme: MAILGEN_PRODUCT_THEME,
    product: {
      name: MAILGEN_PRODUCT_NAME,
      link: MAILGEN_PRODUCT_LINK,
      logo: MAILGEN_PRODUCT_LOGO,
      copyright: MAILGEN_PRODUCT_COPYRIGHT,
    },
  },
  nodemailer: {
    service: NODEMAILER_SERVICE,
    host: NODEMAILER_HOST,
    port: parseInt(NODEMAILER_PORT),
    secure: true,
    auth: {
      user: NODEMAILER_USERNAME,
      pass: NODEMAILER_PASSWORD,
    },
  },
};
