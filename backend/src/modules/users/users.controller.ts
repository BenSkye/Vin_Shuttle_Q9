import { Body, Controller, Get, Inject, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/role.guard';
import { USER_SERVICE } from 'src/modules/users/users.di-token';
import { UpdateUserDto } from 'src/modules/users/users.dto';
import { IUserService } from 'src/modules/users/users.port';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(@Inject(USER_SERVICE) private readonly service: IUserService) { }


    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth('authorization')
    @ApiOperation({ summary: 'View  profile user' })
    async getAllUsers() {
        return await this.service.listUsers();
    }


    @Get('profile')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('authorization')
    @ApiOperation({ summary: 'View personal profile' })
    async getProfile(@Request() req) {
        return await this.service.viewProfile(req.user._id);
    }

    @Put('profile')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('authorization')
    @ApiOperation({ summary: 'Update personal profile' })
    @ApiBody({
        type: UpdateUserDto,
        description: 'Update personal profile',
        examples: {
            'Update personal profile': {
                value: {
                    name: 'KhanhHg',
                    phone: '00800808808',
                    email: 'KhanhHg8386@gmail.com'
                }
            }
        }
    })
    async updateProfile(@Request() req, @Body() user: UpdateUserDto) {
        return await this.service.updateProfile(req.user._id, user);
    }

}
