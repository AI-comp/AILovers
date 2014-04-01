import java.io.IOException;
import java.util.Scanner;
import java.util.regex.Pattern;
import java.util.Random;

public class MockAI {

	/**
	 * @param args
	 * @throws IOException 
	 */
	public static void main(String[] args) throws IOException {
		// TODO Auto-generated method stub
		
		int turn, numHeroes, numHeroines, player;
		char day;
		
		Scanner scanner = new Scanner(System.in);
		turn = scanner.nextInt();
		day = scanner.next("[a-zA-Z]").charAt(0);
		numHeroes = scanner.nextInt();
		numHeroines = scanner.nextInt();
		player = scanner.nextInt();
		
		int[][] values = new int[numHeroes][numHeroines];

		for (int i = 0; i < numHeroes; ++i) {
			for (int j = 0; j < numHeroines; ++j) {
				values[i][j] = scanner.nextInt();
			}
		}

		int retNum = 0;
		if(day == 'W') {
			retNum = 5;
		} else if(day == 'H') {
			retNum = 2;
		}
		
		Random r = new Random();
		for (int i = 0; i < retNum; ++i)
		{
			System.out.print(r.nextInt(numHeroines) + " ");
		}
	}
}
