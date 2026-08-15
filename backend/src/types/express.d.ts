declare global {
  namespace Express {
    interface User {
      id: string;
      _id?: string;
      name: string;
      email: string;
      role: string;
      phone?: string | null;
      avatar?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
    }

    interface Request {
      guestCartId?: string | null;
    }
  }
}

export {};
