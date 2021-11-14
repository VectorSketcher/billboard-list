
import { Users, UsersResponse } from '../types/models/users';
import { PagedResponseBody, ResponseBody } from '../types/response';
import { ContextRequest, DELETE, GET, Errors, PATCH, PathParam, POST, PUT, QueryParam, Return, Path, Param } from 'typescript-rest';
import { Tags } from 'typescript-rest-swagger';
import { InternalServerError } from 'typescript-rest/dist/server/model/errors';
import { getPagingInfo } from '../lib/getPagingInfo';
import UserDataManager from '../managers/UserDataManager';
import { isConditionalExpression } from 'typescript';

@Tags('Registered Users')
@Path('/getusers')
class UsersRouter {
  private userDataManager = new UserDataManager();
  /**
        * Get list of registered users
        * @Param offset
        * @Param limit
        */
  @GET
  async getUsers(
    @QueryParam('offset') offset: number = 0,
    @QueryParam('limit') limit: number = 20): Promise<PagedResponseBody<UsersResponse[]>> {
    try {
      const [allUsers] = await Promise.all([
        this.userDataManager.getUsers()
      ]);
      // page count of all users
      const count = Array.prototype.push.apply(allUsers);
      // returning data along with pagination
      return {
        data: allUsers,
        paging: getPagingInfo('/getusers', offset, limit, count)
      };
    } catch (err) {
      throw (err instanceof Errors.HttpError) ? err : new InternalServerError();
    }
  }
}
export default UsersRouter;
