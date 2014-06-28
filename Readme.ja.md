AI Lovers
========

公式サイト
- http://www.ai-comp.net/cedec2014/
- http://cedec.cesa.or.jp/2014/ (TBD)

# 参加者の皆さんへ

このゲームで遊ぶには二つの方法があります。

- オンラインプレイ： [Contest Server](http://arena.ai-comp.net) にAIファイルを提出し、他のAIと対戦します。
- オフラインプレイ： [node.js](http://nodejs.org/) をインストールする必要があります。実行方法は以下の通りです。

# インストール手順

## Windows

1. [node.js](http://nodejs.org/) のインストーラーをダウンロード＆実行
2. `install.bat` を実行

## Mac OS / Linux

1. [nodebrew](https://github.com/hokaccha/nodebrew) および nodejs をインストール
    1. `curl -L git.io/nodebrew | perl - setup`
    2. bashを使っている人は `echo "export PATH=$HOME/.nodebrew/current/bin:$PATH" >> .bashrc`  
       zshを使っている人は `echo "export PATH=$HOME/.nodebrew/current/bin:$PATH" >> .zshrc`
    3. bashを使っている人は `source ~/.bashrc`  
       zshを使っている人は `source ~/.zshrc`
    4. `nodebrew install stable`
    5. `nodebrew use stable`
2. `install.sh` を実行

## ローカル環境での実行方法 via ブラウザ

1. `execute_on_browser.bat` or `execute_on_browser.sh` を実行
2. AI 0～3 の欄にAI実行用のコマンドを入力
3. "Run Game" をクリックしてゲームを開始

## ローカル環境での実行方法 via CUI

1. `execute_on_cui.bat` or `execute_on_cui.sh` を実行
2. `execute_on_cui.bat -a "python ai1.py" -a "python ai2.py"` を実行  
1つ目のAIは `python ai1.py`、2つ目のAIは `python ai1.py`、3つ目と4つ目のAIはデフォルト（`python ai/ai.py`）
