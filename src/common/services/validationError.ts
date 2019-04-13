export interface IFieldError {
  fieldName: string;
  error: string;
}

export class ValidationError extends Error {
  public fieldErrors: IFieldError[];

  constructor(m: string) {
    super(m);
  }
}
