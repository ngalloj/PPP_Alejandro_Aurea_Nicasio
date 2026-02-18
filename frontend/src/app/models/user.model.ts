// frontend/src/app/models/user.model.ts
export interface User {
    id: number;
    email: string;
    rol: 'admin' | 'user'; // puedes ampliar roles si tu app crece
  }
  