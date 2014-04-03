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

	# for h in heroines:
		# print(h.myRealScore, file=sys.stderr)
	command = []
	targetValue = 45 / numHeroines
	if day == 'W':
		dateCount = 5
	else:
		dateCount = 2
	for i in range(numHeroines):
		for j in range(int(targetValue - {'W': 0, 'H': 1}[day] - heroines[i].myRealScore)):
			command.append(i)
		if len(command) >= dateCount:
			break
	while len(command) < dateCount:
		command.append(str(random.randrange(numHeroines)))

	print(' '.join(map(str,command)))
	sys.stdout.flush()
