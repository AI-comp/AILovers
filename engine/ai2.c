#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(){

	int turn, player;
	char day;
	int values[4][6];

	scanf("%d \n", &turn);
	scanf("%c %d \n", &day, &player);

	for (int i = 0; i < 4; ++i) {
		for (int j = 0; j < 6; ++j) {
			scanf(" %d", values[i]+j);
		}
	}

	int retNum = 0;
	if(day == 'W') {
		retNum = 5;
	} else if(day == 'H') {
		retNum = 2;
	}

	srand((unsigned)time(0));

	for (int i = 0; i < retNum; ++i)
	{
		printf("%d ", rand()%3);
	}
	printf("\n");
}