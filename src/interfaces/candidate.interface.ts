/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Defines the ICandidate interface for candidate data.
 * @version 1.0.0
 * @module candidateInterface
 */

import { Optional } from 'sequelize';

/**
 * Interface representing the attributes of a candidate.
 */
interface ICandidate {
  [x: string]: any;
  id?: number;
  firstName: string;
  lastName: string;
  title?: string;
  skills?: string[];
  isEmployed?: boolean;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICandidateQuery {
  id?: number;
  userId?: number;
}

interface ICandidatesQuery {
  skills?: string[];
  isEmployed?: boolean;
}

/**
 * Interface for creating a new candidate (excluding autogenerated fields).
 */
type ICandidateCreation = Optional<
  ICandidate,
  'id' | 'createdAt' | 'updatedAt'
>;

export { ICandidate, ICandidateQuery, ICandidatesQuery, ICandidateCreation };