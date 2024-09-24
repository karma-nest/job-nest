/**
 * @fileoverview
 * @module
 * @version
 */
import { notificationConfig } from '../configs';
import { NotificationLib } from '../libs';

const { NX_AUTHENTICATION_API, NX_RECRUITER_URL, NX_CANDIDATE_URL } =
  process.env;

export default class AuthTemplate {
  private generateActivationUrl = (activationToken: string): string => {
    return `${NX_AUTHENTICATION_API}/api/v1/auth/activate?token=${encodeURIComponent(
      activationToken
    )}`;
  };

  private generatePasswordResetUrl = (
    role: string,
    passwordToken: string
  ): string => {
    const url =
      role === 'candidate'
        ? NX_CANDIDATE_URL
        : role === 'recruiter'
        ? NX_RECRUITER_URL
        : NX_CANDIDATE_URL;

    return `${url}/auth/reset-password?token=${encodeURIComponent(
      passwordToken
    )}`;
  };

  constructor(
    private readonly notificationUtil: NotificationLib = new NotificationLib()
  ) {}

  public activateAccount = (email: string, activationToken: string): string => {
    const activationUrl = this.generateActivationUrl(activationToken);

    return this.notificationUtil.getMailgenInstance('salted').generate({
      body: {
        title: `Activate your ${notificationConfig?.mailgen?.product?.name} account`,
        intro: `You just signed up for a new ${notificationConfig?.mailgen?.product?.name} account with the username: ${email}.`,
        action: {
          instructions:
            'To finish creating your account, click on the link below within the next 15 minutes.',
          button: {
            text: 'Activate Account',
            color: '#28214c',
            link: activationUrl,
          },
        },
        outro: `Having troubles? Copy this link into your browser instead: ${activationUrl}`,
      },
    });
  };

  public reactivateAccount = (
    email: string,
    activationToken: string
  ): string => {
    const reactivationUrl = this.generateActivationUrl(activationToken);

    return this.notificationUtil.getMailgenInstance('salted').generate({
      body: {
        title: `Reactivate your ${notificationConfig?.mailgen?.product?.name} account`,
        intro: `We noticed your ${notificationConfig?.mailgen?.product?.name} account for username ${email} is currently inactive.`,
        action: {
          instructions:
            'To reactivate your account, click on the button below within the next 15 minutes.',
          button: {
            text: 'Reactivate Account',
            color: '#28214c',
            link: reactivationUrl,
          },
        },
        outro: `Having troubles? Copy this link into your browser instead: ${reactivationUrl}`,
      },
    });
  };

  public forgotPassword = (
    email: string,
    token: string,
    role: string
  ): string => {
    const resetUrl = this.generatePasswordResetUrl(role, token);

    return this.notificationUtil.getMailgenInstance('salted').generate({
      body: {
        title: `Hello, ${email}.`,
        intro: 'Someone has requested a link to change your password.',
        action: {
          instructions:
            'To reset your password, click the button below within the next 30 minutes. If you ignore this message, your password will not be changed.',
          button: {
            text: 'Reset Password',
            color: '#28214c',
            link: resetUrl,
          },
        },
        outro: `Having troubles? Copy this link into your browser instead: ${resetUrl}`,
      },
    });
  };

  public passwordUpdate = (
    email: string,
    device: {
      ip: string;
      timestamp: string;
    }
  ): string => {
    return this.notificationUtil.getMailgenInstance('salted').generate({
      body: {
        title: `Hi, ${email}.`,
        intro: `Your ${notificationConfig?.mailgen?.product?.name} account password has been successfully updated.`,
        table: {
          data: [
            { item: 'IP', description: device.ip },
            { item: 'Timestamp', description: device.timestamp },
          ],
          columns: {
            customWidth: {
              item: '20%',
              description: '80%',
            },
            customAlignment: {
              item: 'left',
              description: 'left',
            },
          },
        },
        outro: `If you did not make this change or need further assistance, please contact our support team at support@${notificationConfig?.mailgen?.product?.link}.`,
      },
    });
  };
}
