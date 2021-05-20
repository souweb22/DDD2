import { createRandomIdString } from 'src/util/random'
import { prisma } from '@testUtil/prisma'
import { TeamRepository } from '../../repository/team-repository'
import { Team } from 'src/domain/entity/team/team'
import { seedAllUserStatus } from '@testUtil/user-status-factory'
import { seedUser } from '@testUtil/user/seed-user'
import { seedTeam, seedTeamUser } from '@testUtil/team/seed-team'

describe('team-repository.integration.ts', () => {
  const teamRepo = new TeamRepository(prisma)
  beforeEach(async () => {
    await prisma.teamUser.deleteMany()
    await prisma.user.deleteMany()
    await prisma.team.deleteMany()
    await prisma.userStatus.deleteMany()
  })
  afterAll(async () => {
    await prisma.teamUser.deleteMany()
    await prisma.user.deleteMany()
    await prisma.team.deleteMany()
    await prisma.userStatus.deleteMany()

    await prisma.$disconnect()
  })

  describe('findAll', () => {
    it('[正常系]teamを全て取得できる', async () => {
      await seedAllUserStatus()
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedUser({ id: '3' })
      await seedTeam({ id: '1' })
      await seedTeamUser({ userId: '1', teamId: '1' })
      await seedTeamUser({ userId: '2', teamId: '1' })
      await seedTeamUser({ userId: '3', teamId: '1' })

      const teams = await teamRepo.findAll()
      expect(teams).toHaveLength(1)
    })
  })

  describe('findById', () => {
    it('[正常系]特定のidのteamを取得できる', async () => {
      await seedAllUserStatus()
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedUser({ id: '3' })
      await seedUser({ id: '4' })
      await seedUser({ id: '5' })
      await seedUser({ id: '6' })
      await seedTeam({ id: '1' })
      await seedTeam({ id: '2' })
      await seedTeamUser({ userId: '1', teamId: '1' })
      await seedTeamUser({ userId: '2', teamId: '1' })
      await seedTeamUser({ userId: '3', teamId: '1' })
      await seedTeamUser({ userId: '4', teamId: '2' })
      await seedTeamUser({ userId: '5', teamId: '2' })
      await seedTeamUser({ userId: '6', teamId: '2' })

      const team = await teamRepo.findById('1')
      expect(team).toEqual(expect.any(Team))
    })
  })

  describe('findByUserId', () => {
    it('[正常系]特定のuserIdのteamを取得できる', async () => {
      await seedAllUserStatus()
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedUser({ id: '3' })
      await seedUser({ id: '4' })
      await seedUser({ id: '5' })
      await seedUser({ id: '6' })
      await seedTeam({ id: '1' })
      await seedTeam({ id: '2' })
      await seedTeamUser({ userId: '1', teamId: '1' })
      await seedTeamUser({ userId: '2', teamId: '1' })
      await seedTeamUser({ userId: '3', teamId: '1' })
      await seedTeamUser({ userId: '4', teamId: '2' })
      await seedTeamUser({ userId: '5', teamId: '2' })
      await seedTeamUser({ userId: '6', teamId: '2' })

      const team = await teamRepo.findByUserId('4')
      expect(team).toEqual(expect.any(Team))
    })
  })

  describe('findByName', () => {
    it('[正常系]特定のnameのteamを取得できる', async () => {
      await seedAllUserStatus()
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedUser({ id: '3' })
      await seedTeam({ id: '1', name: '7' })
      await seedTeamUser({ userId: '1', teamId: '1' })
      await seedTeamUser({ userId: '2', teamId: '1' })
      await seedTeamUser({ userId: '3', teamId: '1' })

      const team = await teamRepo.findByName('7')
      expect(team).toEqual(expect.any(Team))
    })
  })

  describe('findMostLeastTeam', () => {
    it('[正常系]チーム参加者が最小のteamを取得できる', async () => {
      await seedAllUserStatus()
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedUser({ id: '3' })
      await seedUser({ id: '4' })
      await seedUser({ id: '5' })
      await seedUser({ id: '6' })
      await seedUser({ id: '7' })
      await seedTeam({ id: '1' })
      await seedTeam({ id: '2' })
      await seedTeamUser({ userId: '1', teamId: '1' })
      await seedTeamUser({ userId: '2', teamId: '1' })
      await seedTeamUser({ userId: '3', teamId: '1' })
      await seedTeamUser({ userId: '4', teamId: '2' })
      await seedTeamUser({ userId: '5', teamId: '2' })
      await seedTeamUser({ userId: '6', teamId: '2' })
      await seedTeamUser({ userId: '7', teamId: '2' })

      const team = await teamRepo.findMostLeastTeam('2')
      expect(team).toEqual(expect.any(Team))
      expect(team).toEqual({
        id: '1',
        name: expect.anything(),
        teamUsers: expect.anything(),
      })
    })
  })

  describe('save', () => {
    it('[正常系]teamを保存できる', async () => {
      await seedAllUserStatus()
      const user1 = await seedUser({ id: '1' })
      const user2 = await seedUser({ id: '2' })
      const user3 = await seedUser({ id: '3' })
      const teamExpected = {
        id: createRandomIdString(),
        name: '7',
        users: [user1, user2, user3],
      }
      let allTeams = await prisma.team.findMany()
      expect(allTeams).toHaveLength(0)

      await teamRepo.save(new Team(teamExpected))

      allTeams = await prisma.team.findMany()
      expect(allTeams).toHaveLength(1)
    })
  })

  describe('delete', () => {
    it('[正常系]特定のidのteamを削除できる', async () => {
      await seedAllUserStatus()
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedUser({ id: '3' })
      await seedUser({ id: '4' })
      await seedUser({ id: '5' })
      await seedUser({ id: '6' })
      await seedTeam({ id: '1' })
      await seedTeam({ id: '2' })
      await seedTeamUser({ userId: '1', teamId: '1' })
      await seedTeamUser({ userId: '2', teamId: '1' })
      await seedTeamUser({ userId: '3', teamId: '1' })
      await seedTeamUser({ userId: '4', teamId: '2' })
      await seedTeamUser({ userId: '5', teamId: '2' })
      await seedTeamUser({ userId: '6', teamId: '2' })

      let allTeams = await prisma.team.findMany()
      expect(allTeams).toHaveLength(2)

      await teamRepo.delete('1')
      allTeams = await prisma.team.findMany()
      expect(allTeams).toHaveLength(1)
    })
  })

  describe('deleteTeamUser', () => {
    it('[正常系]特定のidのtaemUserを削除できる', async () => {
      await seedAllUserStatus()
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedUser({ id: '3' })
      await seedUser({ id: '4' })
      await seedTeam({ id: '1' })
      await seedTeamUser({ userId: '1', teamId: '1' })
      await seedTeamUser({ userId: '2', teamId: '1' })
      await seedTeamUser({ userId: '3', teamId: '1' })
      await seedTeamUser({ userId: '4', teamId: '1' })

      let team = await prisma.team.findFirst({
        include: {
          users: true,
        },
      })
      expect(team?.users).toHaveLength(4)

      await teamRepo.deleteTeamUser('3')
      team = await prisma.team.findFirst({
        include: {
          users: true,
        },
      })
      expect(team?.users).toHaveLength(3)
    })
  })
})
