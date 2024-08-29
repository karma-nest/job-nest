/**
 * @fileoverview Email templates for notifying candidates about application status updates.
 * @module ApplicationTemplate
 * @version 1.0.0
 */

import { IApplicationDTO } from '../dtos/application.dto';
import { NotificationLib } from '../libs';

export default class ApplicationTemplate {
  constructor(
    private readonly notificationUtil: NotificationLib = new NotificationLib()
  ) {}

  public applicationReceived = (
    firstName: string,
    application: Partial<IApplicationDTO>
  ): string => {
    return this.notificationUtil.getMailgenInstance('salted').generate({
      body: {
        title: `Application Received for ${application.job.title}`,
        intro: `Hello ${firstName}, your application for the ${application.job.title} position has been received at ${application.job.recruiter.name}.`,
        action: {
          instructions:
            'We will review your application and get back to you shortly. Thank you for applying!',
          button: {
            text: 'View Job Posting',
            color: '#28214c',
            link: `${process.env.NX_CANDIDATE_URL}/jobs/${encodeURIComponent(
              application.job.id
            )}`,
          },
        },
        outro: `If you have any questions, feel free to contact our support team at ${application.job.recruiter.email}.`,
      },
    });
  };

  public applicationUnderReview = (
    firstName: string,
    application: IApplicationDTO
  ): string => {
    return this.notificationUtil.getMailgenInstance('salted').generate({
      body: {
        title: `Application Under Review for ${application.job.title}`,
        intro: `Hi ${firstName}, your application for the ${application.job.title} position is currently under review ${application.job.recruiter.name}.`,
        action: {
          instructions:
            'Our team is carefully reviewing your application. We will notify you once a decision has been made.',
          button: {
            text: 'View Application',
            color: '#28214c',
            link: `${process.env.NX_CANDIDATE_URL}/applications`,
          },
        },
        outro: `Thank you for your patience. If you need assistance, contact us at ${application.job.recruiter.email}.`,
      },
    });
  };

  public applicationApproved = (
    firstName: string,
    application: IApplicationDTO
  ): string => {
    return this.notificationUtil.getMailgenInstance('salted').generate({
      body: {
        title: `Congratulations! Application Accepted for ${application.job.title}`,
        intro: `Hello ${firstName}, we are pleased to inform you that your application for the ${application.job.title} position at ${application.job.recruiter.name}has been approved.`,
        action: {
          instructions:
            'We will be in touch soon with the next steps in the hiring process.',
          button: {
            text: 'View Details',
            color: '#28214c',
            link: `${process.env.NX_CANDIDATE_URL}/applications`,
          },
        },
        outro: `If you have any questions, feel free to reach out to our support team at ${application.job.recruiter.email}.`,
      },
    });
  };

  public applicationRejected = (
    firstName: string,
    application: IApplicationDTO
  ): string => {
    return this.notificationUtil.getMailgenInstance('salted').generate({
      body: {
        title: `Application Rejected for ${application.job.title}`,
        intro: `Dear ${firstName}, we regret to inform you that your application for the ${application.job.title} position at ${application.job.recruiter.name} has not been successful.`,
        action: {
          instructions:
            'We encourage you to apply for other positions that match your skills and experience.',
          button: {
            text: 'Browse Jobs',
            color: '#28214c',
            link: `${process.env.NX_CANDIDATE_URL}/jobs`,
          },
        },
        outro: `Thank you for your interest in our company. If you would like feedback or have any questions, please contact us at ${application.job.recruiter.email}.`,
      },
    });
  };
}
