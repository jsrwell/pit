import { messageForCode, NETWORK_ERROR_CODE, UNEXPECTED_ERROR_CODE } from './error-messages'
import type { ProblemDetails } from './problem-details'

function localProblem(code: string, title: string, status: number): ProblemDetails {
  return { type: `urn:cupcakes-store:problem:${code}`, title, status, code }
}

export class ApiError extends Error {
  readonly problem: ProblemDetails

  constructor(problem: ProblemDetails) {
    super(messageForCode(problem.code))
    this.name = 'ApiError'
    this.problem = problem
  }

  get code(): string {
    return this.problem.code
  }

  get status(): number {
    return this.problem.status
  }

  static network(): ApiError {
    return new ApiError(localProblem(NETWORK_ERROR_CODE, 'Network error', 0))
  }

  static unexpected(status: number): ApiError {
    return new ApiError(localProblem(UNEXPECTED_ERROR_CODE, 'Unexpected error', status))
  }
}
