#include <iostream>
#include <vector>
using namespace std;

struct Heroine{
	int value;
	vector<int> revealedScore;
	int realScore;
};
int turn, playerID, HeroesNum = 4, HeroinesNum = 10;
vector<Heroine> Heroines;

void readData(){
	cin >> playerID;
	int val, rScore;
	vector<int> rScores;
	for(int i=0;i<HeroinesNum;i++){
		cin >> val;
		for(int j=0;j<HeroesNum;j++){
			int rs;
			cin >> rs;
			rScores.push_back(rs);
		}
		cin >> rScore;
		Heroine h = {val, rScores, rScore};
		Heroines.push_back(h);
	}
}

void writeCommand(){
	if (turn % 2 == 1){
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
	while(cin >> turn, turn!=-1){
		readData();
		writeCommand();
	}
}
