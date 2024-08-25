/**
 * @fileoverview
 * @module
 * @version
 */
import nodemailer, { Transporter } from 'nodemailer';
import mailGen from 'mailgen';
import { notificationConfig } from '../configs';

export default class NotificationLib {
  constructor() {
    //
  }

  /**
   * Gets the mailgen instance.
   * @returns {mailGen} The mailgen instance.
   */
  public getMailgenInstance = (theme: string): mailGen => {
    return new mailGen({
      theme,
      product: {
        name: notificationConfig?.mailgen?.product?.name,
        link: notificationConfig?.mailgen?.product?.link,
        logo: notificationConfig?.mailgen?.product?.logo,
        copyright: notificationConfig?.mailgen.product?.copyright,
      },
    });
  };

  /**
   * Creates a Nodemailer transport instance with the configuration provided.
   * @returns {Transporter} Nodemailer transport instance.
   */
  public createNodemailerTransport(): Transporter {
    return nodemailer.createTransport({
      host: notificationConfig?.nodemailer?.host,
      port: notificationConfig?.nodemailer?.port,
      secure: notificationConfig?.nodemailer?.secure,
      auth: {
        user: notificationConfig?.nodemailer?.auth?.user,
        pass: notificationConfig?.nodemailer?.auth?.pass,
      },
    });
  }
}
