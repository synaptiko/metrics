#!/usr/bin/env bash
TOKEN=`node -r esm generate-token.js`
BASE_URL=http://localhost:8080/metrics

for i in {1..100}; do
	BUILD_ID=$RANDOM

	curl -X POST $BASE_URL/project-name.time.build-total/$BUILD_ID/$RANDOM'?token='$TOKEN
	curl -X POST $BASE_URL/project-name.time.test-total/$BUILD_ID/$RANDOM'?token='$TOKEN
	curl -X POST $BASE_URL/project-name.time.subproject1/$BUILD_ID/$RANDOM'?token='$TOKEN
	curl -X POST $BASE_URL/project-name.time.subproject2/$BUILD_ID/$RANDOM'?token='$TOKEN
	curl -X POST $BASE_URL/project-name.time.subproject3/$BUILD_ID/$RANDOM'?token='$TOKEN

	curl -X POST $BASE_URL/project-name.size.subproject1.vendor.js/$BUILD_ID/$RANDOM'?token='$TOKEN
	curl -X POST $BASE_URL/project-name.size.subproject2.vendor.js/$BUILD_ID/$RANDOM'?token='$TOKEN
	curl -X POST $BASE_URL/project-name.size.subproject3.vendor.js/$BUILD_ID/$RANDOM'?token='$TOKEN

	curl -X POST $BASE_URL/project-name.build.timestamp/$BUILD_ID/`date +'%s'`'?token='$TOKEN
	curl -X POST $BASE_URL/project-name.build.status/$BUILD_ID/success'?token='$TOKEN

	sleep 2
done
