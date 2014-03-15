#include <vector>
#include <map>
#include <set>
#include <stack>
#include <queue>
#include <algorithm>
#include <utility>
#include <functional>
#include <sstream>
#include <iostream>
#include <cstdio>
#include <cmath>
#include <cstdlib>
#include <cctype>
#include <string>
#include <cstring>
#include <ctime>
#include <climits>
#include <fstream>
using namespace std;
inline int toInt(string s) { int v; istringstream sin(s); sin >> v; return v;}
template<class T> inline string toStr(T x) { ostringstream sout; sout << x; return sout.str();}
typedef vector<int> vi;
typedef vector<vi>  vvi;
typedef vector<string> vs;
typedef pair<int, int> pii;
typedef long long ll;
#define ALL(a) (a).begin(),(a).end()
#define RALL(a) (a).rbegin(),(a).rend()
#define FOR(i,a,b) for(int i=(a);i<=(b);++i)
#define REP(i,n) FOR(i,0,(n)-1)
const double EPS = 1e-10;
const double PI = acos(-1.0);
const int INF = INT_MAX/10;

typedef vector<double> vd;
typedef vector<vd> vvd;

const int num_heroine = 7;
const int num_player = 3;
const int num_turn = 2;

string names[] = {"K", "H", "T"};

void show_names() {
	REP(i, num_player) {
		printf("%5s ", names[i].c_str());
	}
	cout << endl;
}

void show_line(vi l) {
	REP(i, num_player) {
		printf("%5d ", l[i]);
	}
	cout << endl;
}

void show_line(vd l) {
	REP(i, num_player) {
		printf("%.3f ", l[i]);
	}
	cout << endl;
}

void show_info(vvi d, vvd l) {
	cout << "date_score" << endl;
	show_names();
	REP(i, num_heroine) {
		show_line(d[i]);
	}
	cout << "love_score" << endl;
	show_names();
	REP(i, num_heroine) {
		show_line(l[i]);
	}
}

int main() {
	vvi date_score(num_heroine, vi(num_player));
	vvd love_score(num_heroine, vd(num_player));

	show_info(date_score, love_score);
	int h;
	REP(i, num_turn) {
		cout << "Turn " << i+1 << ":" << endl;
		REP(p, num_player) {
			cout << names[p] << ": ";
			REP(j, i+1) {
				cin >> h;
				date_score[h-1][p]++;
			}
		}

		REP(h, num_heroine) {
			int sum = 0;
			REP(p, num_player) {
				sum += date_score[h][p];
			}
			REP(p, num_player) {
				if(sum != 0) {
					love_score[h][p] += (double)date_score[h][p] / sum;
				}
			}
		}
		show_info(date_score, love_score);
	}

	vi girlFriends(num_player);
	REP(i, num_heroine) {
		int winner = -1;
		double max_love = -1;
		REP(j, num_player) {
			if(max_love < love_score[i][j]) {
				max_love = love_score[i][j];
				winner = j;
			}
		}

		if(winner != -1) {
			girlFriends[winner]++;
		}
	}

	int winner = -1, max_girl = -1;
	REP(i, num_player) {
		if(max_girl < girlFriends[i]) {
			max_girl = girlFriends[i];
			winner = i;
		}
	}

	cout << "Winner: " << names[winner] << endl;

	return 0;
}