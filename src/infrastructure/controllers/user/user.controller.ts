import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Request } from 'express';
import { ApiResponseType } from 'src/infrastructure/common/decorators/swagger.decorator';
import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwtAuth.guard';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { AddUserUseCases } from 'src/usecases/user/addUser.usecases';
import { GetUsersUseCases } from 'src/usecases/user/getUsers.usecases';
import {
  AddUserDto,
  EmailConfirmationUserDto,
  ResendConfirmationEmailUserDto
} from './user.dto';
import { UserPresenter } from './user.presenter';

@Controller('user')
@ApiTags('user')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(UserPresenter)
export class UserController {
  constructor(
    @Inject(UsecasesProxyModule.POST_USER_USECASES_PROXY)
    private readonly addUserUsecaseProxy: UseCaseProxy<AddUserUseCases>,
    @Inject(UsecasesProxyModule.GET_USERS_USECASES_PROXY)
    private readonly getAllUserUsecaseProxy: UseCaseProxy<GetUsersUseCases>
  ) {}

  @Post('user')
  @ApiResponseType(UserPresenter, true)
  async addUser(@Body() addUserDto: AddUserDto) {
    const { name, email, password } = addUserDto;
    const userCreated = await this.addUserUsecaseProxy
      .getInstance()
      .create(name, email, password);
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

  @Post('email-confirmation')
  async emailConfirmation(
    @Body() emailConfirmationUserDto: EmailConfirmationUserDto,
    @Req() request: Request
  ) {
    const { email, token } = emailConfirmationUserDto;
    const host = request.get('host');
    await this.addUserUsecaseProxy
      .getInstance()
      .setEmailConfirmation(host, token, email);
    return 'Email confirmation successful';
  }

  @Post('resend-confirmation-email')
  async resendConfirmationEmail(
    @Body() resendConfirmationEmailUserDto: ResendConfirmationEmailUserDto
  ) {
    const { email } = resendConfirmationEmailUserDto;
    await this.addUserUsecaseProxy.getInstance().resendConfirmationEmail(email);
    return 'Resend email confirmation successful';
  }
}
