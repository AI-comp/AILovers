<?php

	$fp = fopen('php://stdin', 'r');
	
	$maxTurn;
	$numOfHeroes;
	$numOfHeroines;
	$turn;
	$day;
	$heroines = [];
	
	readGameSetting();
	
	$turn = rtrim(fgets($fp));
	while ($turn != -1) {
		readData();
		writeCommand();
		$turn = rtrim(fgets($fp));
	}
	
	function readGameSetting() {
		global $fp, $maxTurn, $numOfHeroes, $numOfHeroines, $heroines;
		$gameSettings = explode(' ', rtrim(fgets($fp)));
		$maxTurn = $gameSettings[0];
		$numOfHeroes = $gameSettings[1];
		$numOfHeroines = $gameSettings[2];
	
		$gameSettings = explode(' ', rtrim(fgets($fp)));
		foreach ($gameSettings as $value) {
			array_push($heroines, new Heroine((integer)$value));
		}
	}
	
	function readData() {
		global $fp, $numOfHeroes, $numOfHeroines, $heroines;
		$day = rtrim(fgets($fp));
			for ($i = 0; $i < $numOfHeroines; $i++) {
				$revealedScores = explode(' ', rtrim(fgets($fp)));
			}
			$realScores = explode(' ', rtrim(fgets($fp)));
			for ($i = 0; $i < $numOfHeroines; $i++) {
				$heroines[$i]->setRealScore((integer)$realScores[$i]);
			}
	}
	
	function writeCommand() {
		global $numOfHeroines, $turn;
		$command = '';
		if ($turn % 2 === 1) {
			for ($i = 0; $i < 5; $i++) {
				$command = $command . mt_rand(0, $numOfHeroines - 1);
				if($i < 4) {
					$command = $command . ' ';
				}
			}
		} else {
			$command = $command . mt_rand(0, $numOfHeroines - 1) . ' ' . mt_rand(0, $numOfHeroines - 1);
		}
		
		$command = $command . PHP_EOL;
		echo $command;
	}

	class Heroine {
		private $value;
		private $revealedScore;
		private $realScore;
		
		function __construct($value = 0, $revealedScore = 0, $realScore = 0) {
			$this->value = $value;
			$this->revealedScore = $revealedScore;
			$this->realScore = $realScore;
		}
		
		public function getValue() {
			return $this->value;
		}
		
		public function setValue($value) {
			$this->value = $value;
		}
		
		public function getRevealedScore() {
			return $this->revealedScore;
		}
		
		public function setRevealedScore($revealedScore) {
			$this->revealedScore = $revealedScore;
		}
		
		public function getRealScore() {
			return $this->realScore;
		}
		
		public function setRealScore($realScore) {
			$this->realScore = $realScore;
		}
	}
