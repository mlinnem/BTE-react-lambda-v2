cd lambda

../buildLambda.sh createBallots
../buildLambda.sh getAnimals
../buildLambda.sh getAuthKey
../buildLambda.sh processBallots
../buildLambda.sh submitBallot
../buildLambda.sh updateIPData
../buildLambda.sh cleanUpStaleSessions
cd ..
./buildS3.sh
