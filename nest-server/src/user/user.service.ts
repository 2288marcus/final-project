import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getProfile(id: number) {
    return { id: 1, username: 'alice' };
  }
  updateProfile(
    id: number,
    profile: { email: string; desc: string; nickname: string },
  ) {
    return {};
  }
}
