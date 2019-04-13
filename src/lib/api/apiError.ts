export class ApiError extends Error {
  public statusCode: number;
  constructor(m: string) {
    super(m);
  }
}
