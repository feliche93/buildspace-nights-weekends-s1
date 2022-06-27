sudo docker run -p 6688:6688 -v $(pwd)/chainlink/node:/chainlink -it --env-file=chainlink/node/.env smartcontract/chainlink:1.4.1-root local n -p /chainlink/pw
