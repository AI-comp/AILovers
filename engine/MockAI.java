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
		
		int turn, player;
		char day;
		int[][] values = new int[4][6];
		
		Scanner scanner = new Scanner(System.in);
		turn = scanner.nextInt();
		day = scanner.next("[a-zA-Z]").charAt(0);
		player = scanner.nextInt();
		
		for (int i = 0; i < 4; ++i) {
			for (int j = 0; j < 6; ++j) {
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
			System.out.print(r.nextInt(3) + " ");
		}
	}
}
