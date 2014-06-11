import java.io.PrintWriter;
import java.util.*;

public class SampleAI {
	static int MaxTurn, Turn, PlayersNum, HeroinesNum;
	static char Day;
	static Heroine[] Heroines;
	static final Scanner scanner = new Scanner(System.in);
	static final PrintWriter writer = new PrintWriter(System.out, true);

	public static void main(String[] args) {
		writer.println("READY");
		readInitialData();
		for (int t = 0; t < MaxTurn; t++) {
			readData();
			writeCommand();
		}
		scanner.close();
		writer.close();
	}

	static void readInitialData() {
		MaxTurn = scanner.nextInt();
		PlayersNum = scanner.nextInt();
		HeroinesNum = scanner.nextInt();
		Heroines = new Heroine[HeroinesNum];
		for (int i = 0; i < HeroinesNum; i++) {
			int enthusiasm = scanner.nextInt();
			Heroine h = new Heroine(enthusiasm);
			Heroines[i] = h;
		}
	}

	static void readData() {
		Turn = scanner.nextInt();
		Day = scanner.next().charAt(0);
		for (int i = 0; i < HeroinesNum; i++) {
			int[] revealedScore = new int[PlayersNum];
			for (int j = 0; j < PlayersNum; j++) {
				revealedScore[j] = scanner.nextInt();
			}
			Heroines[i].revealedScore = revealedScore;
		}
		for (int i = 0; i < HeroinesNum; i++) {
			int realScore = scanner.nextInt();
			Heroines[i].realScore = realScore;
		}
		if (Day == 'W') {
			for (int i = 0; i < HeroinesNum; i++) {
				int dated = scanner.nextInt();
				Heroines[i].dated = (dated == 1);
			}
		}
	}

	static void writeCommand() {
		StringBuilder command = new StringBuilder();
		Random random = new Random();
		for (int i = 0; i < (Day == 'W' ? 5 : 2); i++) {
			int c = random.nextInt(HeroinesNum);
			command.append(c);
			if (i < 4) {
				command.append(" ");
			}
		}
		writer.println(command.toString());
	}
}

class Heroine {
	int enthusiasm, revealedScore[], realScore;
	boolean dated;

	Heroine(int enthusiasm) {
		this.enthusiasm = enthusiasm;
	}
}
