parts restart apache2
pkill -f node
cd ~/workspace/blackjack-backend
node app.js > console.log &
cd ~/workspace/blackjack
brunch watch --server
