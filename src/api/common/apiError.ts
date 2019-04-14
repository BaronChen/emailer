export interface IErrorDetail {
  field: string;
  errorMessage: string;
  value: string;
}

export class ApiError extends Error {
  public statusCode: number;
  public errorDetails: Record<string, IErrorDetail>;

  constructor(
    m: string,
    statusCode?: number,
    errorDetails?: Record<string, IErrorDetail>
  ) {
    super(m);

    if (statusCode) {
      this.statusCode = statusCode;
    }

    if (errorDetails) {
      this.errorDetails = errorDetails;
    }

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
