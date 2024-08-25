/**
 * @fileoverview Utility class for sending notifications via email.
 * @version 1.0.0
 * @module NotificationUtil
 */

import { NotificationLib } from '../libs';
import { notificationConfig } from '../configs';

/**
 * A utility class for handling email notifications.
 * @class NotificationUtil
 */
export default class NotificationUtil {
  private readonly notificationUtil: NotificationLib;

  /**
   * Creates an instance of NotificationUtil.
   */
  constructor() {
    this.notificationUtil = new NotificationLib();
  }

  /**
   * Sends an email using Nodemailer.
   * @param {string} receiver - The email address of the recipient.
   * @param {string} subject - The subject of the email.
   * @param {string} template - The HTML template for the email body.
   * @param {(error: Error | null) => void} callback - A callback function that is called when the email is sent or an error occurs.
   */
  public sendEmail(
    receiver: string,
    subject: string,
    template: string,
    callback: (error: Error | null) => void
  ): void {
    this.notificationUtil.createNodemailerTransport().sendMail(
      {
        from: `No-reply <${notificationConfig?.nodemailer?.auth?.user}>`,
        to: receiver,
        subject,
        html: template,
      },
      (error) => {
        if (error) {
          callback(new Error(`Failed to send email: ${error.message}`));
        } else {
          callback(null);
        }
      }
    );
  }
}
