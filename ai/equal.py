import sys
import random

class Heroine:
	def __init__(self, enthusiasm):
		self.enthusiasm = enthusiasm
		self.revealedLove = []
		self.myRealLove = 0

def readLine():
	return list(map(int, input().split()))

totalTurn, numPlayers, numHeroines = readLine()
enthusiasm = readLine()
heroines = []
for i in range(numHeroines):
	heroines.append(Heroine(enthusiasm[i]))

while True:
	turn = int(input())
	if turn == -1:
		break
	day = input()

	for i in range(numHeroines):
		heroines[i].revealedLove = readLine()
	
	realLove = readLine()
	for i in range(numHeroines):
		heroines[i].myRealLove = realLove[i]

	# for h in heroines:
		# print(h.myRealLove, file=sys.stderr)
	command = []
	targetValue = 45 / numHeroines
	if day == 'W':
		dateCount = 5
	else:
		dateCount = 2
	for i in range(numHeroines):
		for j in range(int(targetValue - {'W': 0, 'H': 1}[day] - heroines[i].myRealLove)):
			command.append(i)
		if len(command) >= dateCount:
			break
	while len(command) < dateCount:
		command.append(str(random.randrange(numHeroines)))

	print(' '.join(map(str,command)))
	sys.stdout.flush()
