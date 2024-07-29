import config from "../config/config";
import { Client, Account, ID } from "appwrite";
import { User } from "./User";

export class Auth {
  client = new Client();
  user = new User();
  account;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async register(name, email, password) {
    try {
      const userAccount = await this.account.create( ID.unique(), email, password );

      if (userAccount) {
        const userData = await this.account.createEmailPasswordSession( email, password );
        const userProfile = await this.user.completeProfile({
          userId: userAccount.$id,
          userProfile: { name, avatar: "", about: "" },
        });
        return userProfile;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Appwrite service :: register :: error", error);
    }
  }

async login(email, password) {
  try {
      // Check if there is an active session
      const currentUser = await this.getUser();
      
      if (currentUser) {
          // If a session exists, return the user profile or handle accordingly
          console.log("Session already active for user:", currentUser);
          return await this.user.getProfile(currentUser.$id);
      } else {
          // If no active session, create a new one
          const session = await this.account.createEmailPasswordSession(email, password);
          
          if (session) {
              const userProfile = await this.user.getProfile(session.userId);
              return userProfile;
          } else {
              return null;
          }
      }
  } catch (error) {
      console.log("Appwrite service :: login :: error", error);
      return null;
  }
}



  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
    }
  }
  async getUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite service :: getUser :: error", error);
    }
  }

  
}
const authInstance = new Auth();

export default authInstance;
