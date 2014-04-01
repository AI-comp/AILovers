import sys
import random


class Heroine:
    def __init__(self):
        self.value = 0
        self.revealedScore = []
        self.myRealScore = 0


while True:
    turn = int(input())
    if turn == -1:
        break
    gameInfo = input().split()
    gameInfo[1:3] = map(int, gameInfo[1:3])
    (day, numHeroes, numHeroines, playerIndex) = gameInfo

    heroines = []
    for i in range(numHeroines):
        heroine = Heroine()
        heroineInfo = list(map(int, input().split()))
        heroine.value = heroineInfo[0]
        heroine.revealedScore = heroineInfo[1:numHeroes]
        heroine.myRealScore = heroineInfo[numHeroes + 1]
        heroines.append(heroine)

    command = []
    for i in range({'W': 5, 'H': 2}[day]):
        command.append(str(random.randrange(numHeroines)))
