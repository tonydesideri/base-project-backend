import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserPresenter } from './user.presenter';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { addUserUseCases } from 'src/usecases/user/addUser.usecases';
import { ApiResponseType } from 'src/infrastructure/common/swagger/response.decorator';
import { AddUserDto } from './user.dto';
import { getUsersUseCases } from 'src/usecases/user/getUsers.usecases';
import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwtAuth.guard';

@Controller('user')
@ApiTags('user')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(UserPresenter)
export class UserController {
  constructor(
    @Inject(UsecasesProxyModule.POST_USER_USECASES_PROXY)
    private readonly addUserUsecaseProxy: UseCaseProxy<addUserUseCases>,
    @Inject(UsecasesProxyModule.GET_USERS_USECASES_PROXY)
    private readonly getAllUserUsecaseProxy: UseCaseProxy<getUsersUseCases>,
  ) {}

  @Post('user')
  @ApiResponseType(UserPresenter, true)
  async addUser(@Body() addUserDto: AddUserDto) {
    const { username, password } = addUserDto;
    const userCreated = await this.addUserUsecaseProxy.getInstance().execute(username, password);
    return new UserPresenter(userCreated);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponseType(UserPresenter, true)
  async getUsers() {
    const users = await this.getAllUserUsecaseProxy.getInstance().execute();
    return users.map((users) => new UserPresenter(users));
  }
}