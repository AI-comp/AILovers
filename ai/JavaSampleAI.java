import java.io.PrintWriter;
import java.util.*;

public class JavaSampleAI {
	static int MaxTurn, Turn, HeroesNum, HeroinesNum;
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
		HeroesNum = scanner.nextInt();
		HeroinesNum = scanner.nextInt();
		Heroines = new Heroine[HeroinesNum];
		for (int i = 0; i < HeroinesNum; i++) {
			int value = scanner.nextInt();
			Heroine h = new Heroine(value);
			Heroines[i] = h;
		}
	}

	static void readData() {
		Turn = scanner.nextInt();
		Day = scanner.next().charAt(0);
		for (int i = 0; i < HeroinesNum; i++) {
			int[] revealedScore = new int[HeroesNum];
			for (int j = 0; j < HeroesNum; j++) {
				revealedScore[j] = scanner.nextInt();
			}
			Heroines[i].revealedScore = revealedScore;
		}
		for (int i = 0; i < HeroinesNum; i++) {
			int realScore = scanner.nextInt();
			Heroines[i].realScore = realScore;
		}
	}

	static void writeCommand() {
		StringBuilder command = new StringBuilder();
		Random random = new Random();
		if (Turn % 2 == 1) {
			for (int i = 0; i < 5; i++) {
				int c = random.nextInt(HeroinesNum);
				command.append(c);
				if (i < 4) {
					command.append(" ");
				}
			}
		} else {
			int c = random.nextInt(HeroinesNum);
			command.append(c);
			command.append(" ");
			c = random.nextInt(HeroinesNum);
			command.append(c);
		}
		writer.println(command.toString());
	}
}

class Heroine {
	int value, revealedScore[], realScore;

	Heroine(int value) {
		this.value = value;
	}

	Heroine(int value, int[] revealedScore, int realScore) {
		this.value = value;
		this.revealedScore = revealedScore;
		this.realScore = realScore;
	}
}
