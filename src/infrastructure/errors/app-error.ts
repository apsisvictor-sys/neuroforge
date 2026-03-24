export class AppError extends Error {
  public readonly code: string;
  public readonly httpStatus: number;
  public readonly expose: boolean;

  constructor(options: {
    message: string;
    code: string;
    httpStatus: number;
    expose?: boolean;
  }) {
    super(options.message);
    this.code = options.code;
    this.httpStatus = options.httpStatus;
    this.expose = options.expose ?? false;
  }
}
