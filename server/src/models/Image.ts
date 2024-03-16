import db from "../config/db";

interface Image {
    user_id: number;
    image_url?: string;
    cover_url?: string;
}

class ImageModel {
    user_id: number;
    image_url?: string;
    cover_url?: string;
    constructor({ user_id, image_url, cover_url }: Image) {
        this.user_id = user_id;
        this.image_url = image_url;
        this.cover_url = cover_url;
    }
    async save(): Promise<boolean | string> {
        try {
            const { data, error } = await db.from("images").insert(this).single();
            if (error)
                throw error;
            return true;
        } catch (err: any) {
            console.log(err);
            return err;
        }
    }
}
export default ImageModel;