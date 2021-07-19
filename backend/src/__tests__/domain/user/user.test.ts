import { User } from 'src/domain/user/user'
import { UserId } from 'src/domain/user/user-id'
import { UserStatus } from 'src/domain/user/user-status'

describe('user.ts', () => {
  describe('changeStatus', () => {
    it('[正常系]userStatusを変更できる', async () => {
      const user = new User({
        id: new UserId('1'),
        name: 'user1',
        mailAddress: 'sample@example.com',
        status: new UserStatus(UserStatus.active),
      })

      user.changeStatus(new UserStatus(UserStatus.recess))
      expect(user.getAllProperties().status).toEqual({
        value: UserStatus.recess,
        _: '',
      })
    })
  })
})
