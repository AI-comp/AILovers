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

	command = []
	for i in range({'W': 5, 'H': 2}[day]):
		command.append(str(random.randrange(numHeroines)))

	print(' '.join(command))
	sys.stdout.flush()
