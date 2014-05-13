#include <iostream>
#include <vector>
#include <stdlib.h>
using namespace std;

struct Heroine{
	int value;
	vector<int> revealedScore;
	int realScore;
};
int MaxTurn, Turn, HeroesNum, HeroinesNum;
vector<Heroine> Heroines;
char Day;

void readInitialData(){
	cin >> MaxTurn >> HeroesNum >> HeroinesNum;
	for(int i=0;i<HeroinesNum;i++){
		Heroine h;
		cin >> h.value;
		Heroines.push_back(h);
	}
}

void readData(){
	cin >> Turn >> Day;
	for(int i=0;i<HeroinesNum;i++){
		vector<int> rScores;
		for(int j=0;j<HeroesNum;j++){
			int rs;
			cin >> rs;
			rScores.push_back(rs);
		}
		Heroines[i].revealedScore = rScores;
	}
	for(int i=0;i<HeroinesNum;i++){
		cin >> Heroines[i].realScore;
	}
}

void writeCommand(){
	if (Turn % 2 == 1){
		for(int i=0;i<5;i++){
			cout << rand() % HeroinesNum;
			if(i<4){
				cout << " ";
			}
		}
	} else {
		for(int i=0;i<2;i++){
			cout << rand() % HeroinesNum;
			if(i<1){
				cout << " ";
			}
		}
	}
	cout << endl;
}

int main(){
	cout << "READY" << endl;
	readInitialData();
	for (int i=0;i<MaxTurn;i++) {
		readData();
		writeCommand();
	}
}
