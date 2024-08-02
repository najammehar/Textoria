import config from "../config/config";
import { Client, Databases, ID, Query, Storage } from "appwrite";
import imageCompression from 'browser-image-compression';

export class Post {
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

    async createPost( slug, {userId, title, category, content, thumbnail, status, description}){
        try {
            // First, check if a document with this slug already exists
            try {
                await this.databases.getDocument(
                    config.appwriteDatabaseId,
                    config.appwriteCollectionIdPosts,
                    slug
                );
                // If we reach here, it means a document with this slug already exists
                throw new Error('A post with this slug already exists');
            } catch (error) {
                // If the error is a 404, it means the document doesn't exist, which is what we want
                if (error.code !== 404) {
                    throw error;
                }
            }
    
            // If we reach here, it means the slug is unique
            const response = await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdPosts,
                slug,  // Use slug as the unique ID
                {
                    userId,
                    title,
                    slug,
                    category,
                    content,
                    thumbnail,
                    status,
                    likes: 0,
                    createdAt: new Date().toISOString(),
                    description,
                }
            );
            return response;
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
            throw error;
        }
    }

    async updatePost(slug, title, category, content, thumbnail, status, description){
        try {
            const response = await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdPosts,
                slug,
                {
                    title,
                    category,
                    content,
                    thumbnail,
                    status,
                    description,
                }
            );
            return response;
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
            throw error;
            
        }
    }

    async deletePost(slug){
        try {
            const response = await this.databases.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdPosts,
                slug
            );
            return response;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            throw error;
        }
    }

    async getPosts(limit, offset, category){
        try {
            const queries = [
                Query.orderDesc("createdAt"),
                Query.limit(limit),
                Query.offset(offset),
                Query.equal("status", "Public")
            ];
    
            if (category) {
                queries.push(Query.equal("category", category));
            }
    
            const response = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdPosts,
                queries
            );
            return response.documents;
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            throw error;
        }
    }
    

    async getPost(slug){
        try {
            const response = await this.databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdPosts,
                slug
            );
            return response;
        } catch (error) {
            console.log("Appwrite service :: getPost :: error", error);
            throw error;
            
        }
    }

    async getPostsByUser(userId, status, limit, offset) {
        try {
            if (!userId) {
                throw new Error("Invalid userId: userId is required.");
            }
            if (!status) {
                throw new Error("Invalid status: status is required.");
            }
            const response = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdPosts,
                [
                    Query.orderDesc("createdAt"),
                    Query.equal("userId", userId),
                    Query.equal("status", status),
                    Query.limit(limit),
                    Query.offset(offset),
                ]
            );
            return response.documents;
        } catch (error) {
            console.log("Appwrite service :: getPostsByUser :: error", error);
            throw error;
        }
    }
    
    async PostsCountByUser(userId, status) {
        try {
            if (!userId) {
                throw new Error("Invalid userId: userId is required.");
            }
            if (!status) {
                throw new Error("Invalid status: status is required.");
            }
            const response = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdPosts,
                [
                    Query.equal("userId", userId),
                    Query.equal("status", status),
                ]
            );
            return response.documents;
        } catch (error) {
            console.log("Appwrite service :: getPostsByUser :: error", error);
            throw error;
        }
    }

    async incrementLikes(slug){
        try {
            const getPost = await this.databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdPosts,
                slug
            );
            const updateLikes = await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdPosts,
                slug,
                {
                    likes: getPost.likes + 1
                }
            );
        } catch (error) {
            console.log("Appwrite service :: incrementLikes :: error", error);
            throw error;
        }
    }

    async decrementLikes(slug){
        try {
            const getPost = await this.databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdPosts,
                slug
            );
            const updateLikes = await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdPosts,
                slug,
                {
                    likes: getPost.likes - 1
                }
            );
        } catch (error) {
            console.log("Appwrite service :: decrementLikes :: error", error);
            throw error;     
        }
    }

    async likePost(userId, slug){
        try {
            const response = await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdLikes,
                ID.unique(),
                {
                    userId,
                    slug,
                    likedAt: new Date().toISOString(),
                }
            );
            await this.incrementLikes(slug);
            return response;
        } catch (error) {
            console.log("Appwrite service :: likePost :: error", error);
            throw error;
        }
    }

    async unLikePost(userId, slug){
        try {
            const getLike = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdLikes,
                [
                    Query.equal("userId", userId),
                    Query.equal("slug", slug),
                ]
            );
            if(getLike.documents.length > 0){
                const response = await this.databases.deleteDocument(
                    config.appwriteDatabaseId,
                    config.appwriteCollectionIdLikes,
                    getLike.documents[0].$id
                );
                await this.decrementLikes(slug);
            }
        } catch (error) {
            console.log("Appwrite service :: unLikePost :: error", error);
            throw error;
        }
    }

    async getLikes(slug){
        try {
            const response = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdLikes,
                [
                    Query.equal("slug", slug),
                ]
            );
            return response.documents;
        } catch (error) {
            console.log("Appwrite service :: getLikes :: error", error);
            throw error;
        }
    }
    async DeleteLikes(slug){
        try {
            const response = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdLikes,
                [
                    Query.equal("slug", slug),
                ]
            );
            if(response.documents.length > 0){
                response.documents.forEach(async (like) => {
                    await this.databases.deleteDocument(
                        config.appwriteDatabaseId,
                        config.appwriteCollectionIdLikes,
                        like.$id
                    );
                });
            }
        } catch (error) {
            console.log("Appwrite service :: DeleteLikes :: error", error);
            throw error;
        }
    }

    async compressImage(file) {
        const options = {
            maxSizeMB: 1, // Maximum file size in MB
            maxWidthOrHeight: 1920, // Maximum width or height
            useWebWorker: true, // Use web worker for compression
        };

        try {
            const compressedBlob = await imageCompression(file, options);

            // Convert Blob to File
            const compressedFile = new File([compressedBlob], file.name, {
                type: file.type,
                lastModified: Date.now()
            });

            return compressedFile;
        } catch (error) {
            console.error("Image compression error:", error);
            throw new Error('Failed to compress image');
        }
    }

    async thumbnailUpload(file) {
        try {
            // Compress the image before uploading
            const compressedFile = await this.compressImage(file);

            const response = await this.bucket.createFile(
                config.appwriteBucketIdFImage,
                ID.unique(),
                compressedFile
            );
            return response;
        } catch (error) {
            console.error("Appwrite service :: thumbnailUpload :: error", error);
            throw new Error('Failed to upload thumbnail');
        }
    }

    async deleteThumbnail(fileId){
        try {
            const response = await this.bucket.deleteFile(
                config.appwriteBucketIdFImage,
                fileId
            );
            return response;
        } catch (error) {
            console.log("Appwrite service :: deleteThumbnail :: error", error);
            throw error;
            
        }
    }

    async getThumbnailPreview(fileId){
        try {
            const response = await this.bucket.getFilePreview(
                config.appwriteBucketIdFImage,
                fileId
            );
            return response;
        } catch (error) {
            console.log("Appwrite service :: getThumbnailPreview :: error", error);
            return null;
        }
    }
}

const post = new Post();
export default post;