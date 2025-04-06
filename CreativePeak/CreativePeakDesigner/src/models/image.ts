import Category from "./category";
import User from "./user";

export default interface Image {
    id: number;
    fileName: string;
    description: string;
    linkURL: string;
    updatedAt: string;
    createdAt: string;
    category: Category;
    user: User;
}
