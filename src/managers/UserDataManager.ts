import axios from 'axios';
import { UsersResponse } from '../types/models/users';

class UserDataManager {
  // get all users
  async getUsers(): Promise<UsersResponse[]> {
    let mergedUsers: any;
    try {
      // step 1, go out and grab data
      const [registered, unregistered, memberships] = await Promise.all([
        this.getRegisteredUsers(),
        this.getUnRegisteredUsers(),
        this.getProjectMemberships()
      ]);
      // step 2, merge registered & unregistered users together into one array
      if (registered && unregistered && memberships) {
        mergedUsers = [...registered, ...unregistered];
        // step 3, for each element of users push empty projectids array
        mergedUsers.forEach(element => {
          element.projectIds = [];
        });
        // step 4, now compare data, if id from users array matches the userid from memberships array, push project ids into an array for users
        for (let i = 0; i < mergedUsers.length; i++) {
          for (let j = 0; j < memberships.length; j++) {
            if (mergedUsers[i].id === memberships[j].userId) {
              mergedUsers[i].projectIds.push(memberships[j].projectId);
            }
          }
        }
        return mergedUsers;
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  // get registered users
  async getRegisteredUsers(): Promise<UsersResponse[]> {
    const result = await axios.get('https://5c3ce12c29429300143fe570.mockapi.io/api/registeredusers');
    return result.data;
  }

  // gets unregistered users
  async getUnRegisteredUsers(): Promise<UsersResponse[]> {
    const result = await axios.get('https://5c3ce12c29429300143fe570.mockapi.io/api/unregisteredusers');
    return result.data;
  }

  // gets project memberships
  async getProjectMemberships(): Promise<UsersResponse[]> {
    const result = await axios.get('https://5c3ce12c29429300143fe570.mockapi.io/api/projectmemberships');
    return result.data;
  }
}

export default UserDataManager;
