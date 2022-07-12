
chainlink-node:
	cd chainlink/node && docker-compose up

fast-api:
	cd chainlink/adapters/twitter && uvicorn main:app --reload

hardhat-deploy:
	cd hardhat && yarn hardhat --network localhost deploy