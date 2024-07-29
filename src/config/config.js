const config = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionIdUser:String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_USERS),
    appwriteCollectionIdLikes:String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_LIKES),
    appwriteCollectionIdPosts:String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_POSTS),
    appwriteBucketIdFImage:String(import.meta.env.VITE_APPWRITE_BUCKET_ID_F_IMAGE),
    appwriteBucketIdPImage:String(import.meta.env.VITE_APPWRITE_BUCKET_ID_P_IMAGE),
}

export default config;