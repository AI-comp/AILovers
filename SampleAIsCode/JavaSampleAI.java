import java.io.PrintWriter;
import java.util.*;

public class JavaSampleAI {
	static int turn, playerID;
	static final int HeroesNum = 4, HeroinesNum = 10;
	static Heroine[] Heroines = new Heroine[HeroinesNum];
	static final Scanner scanner = new Scanner(System.in);
	static final PrintWriter writer = new PrintWriter(System.out, true);

	public static void main(String[] args) {
		while (true) {
			turn = scanner.nextInt();
			if (turn == -1) {
				break;
			}
			readData();
			writeCommand();
		}
		scanner.close();
		writer.close();
	}

	static void readData() {
		playerID = scanner.nextInt();
		for (int i = 0; i < HeroinesNum; i++) {
			int value = scanner.nextInt();
			int[] revealedScore = new int[HeroesNum];
			for (int j = 0; j < HeroesNum; j++) {
				revealedScore[j] = scanner.nextInt();
			}
			int realScore = scanner.nextInt();
			Heroines[i] = new Heroine(value, revealedScore, realScore);
		}
	}

	static void writeCommand() {
		StringBuilder command = new StringBuilder();
		Random random = new Random();
		if (turn % 2 == 1) {
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

	Heroine(int value, int[] revealedScore, int realScore) {
		this.value = value;
		this.revealedScore = revealedScore;
		this.realScore = realScore;
	}
}
