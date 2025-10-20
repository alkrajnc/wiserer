interface Subject {
  name: string;
  subjectCarrier: string;
}
interface ApiResponse<T> {
  message: string;
  error: boolean;
  data: T;
}
