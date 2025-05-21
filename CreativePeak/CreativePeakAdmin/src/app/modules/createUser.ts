export interface CreateUser {
    id: number;
    fullName: string;
    password: string;
    email: string;
    phone: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}
