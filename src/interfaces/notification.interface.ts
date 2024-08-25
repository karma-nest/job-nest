/**
 * @fileoverview
 * @version
 * @module
 */
import mailGen from 'mailgen';

interface IMailgenConfig {
  theme: string;
  product: {
    name: string;
    link: string;
    logo: string;
    copyright: string;
  };
}

interface INodemailerConfig {
  service: string;
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface INotificationConfig {
  mailgen: IMailgenConfig;
  nodemailer: INodemailerConfig;
}

interface INotificationLib {
  getMailgenInstance(): mailGen;
}

export { INotificationConfig, INotificationLib };
