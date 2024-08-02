import config from "../config/config";
import { Client, Databases, ID, Storage, Query } from "appwrite";

export class User {
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId)
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async completeProfile({ userId, userProfile }) {
        const { name, avatar, about, email } = userProfile; // Destructure userProfile object
        try {
            const user = await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdUser,
                userId,
                {
                    userId,
                    name,
                    avatar,
                    about,
                    email
                }
            );
            return user;
        } catch (error) {
            console.log("Appwrite service :: completeProfile :: error", error);
            return null;
        }
    }

    async updateProfile(userId,profileData){
        try {
            const user = await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdUser,
                userId,
                profileData
            );
            return user;
        } catch (error) {
            console.log("Appwrite service :: updateProfile :: error", error);
            return null;
        }
    }

    async getProfile(userId) {
        try {
            const response = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdUser,
                [Query.equal("userId", userId)]
            );
            
            if (response.documents.length > 0) {
                return response.documents[0];
            } else {
                return null;
            }
        } catch (error) {
            console.log("Appwrite service :: getProfile :: error", error);
            return null;
        }
    }   

    async getProfileByEmail(email) {
        try {
            const response = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdUser,
                [Query.equal("email", email)]
            );
            if (response.documents.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log("Appwrite service :: getProfileByEmail :: error", error);
            return null;
        }
    }

    async uploadAvatar(file){
        try {
            return await this.bucket.createFile(
                config.appwriteBucketIdPImage,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite service :: uploadAvatar :: error", error);
            return false;
        }
    }

    async deleteAvatar(fileId){
        try {
            await this.bucket.deleteFile(
                config.appwriteBucketIdPImage,
                fileId
            )
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteAvatar :: error", error);
            return false;
        }
    }

    getAvatarUrl(fileId){
        return this.bucket.getFilePreview(
            config.appwriteBucketIdPImage,
            fileId
        )
    }

}

const user = new User();
export default user;