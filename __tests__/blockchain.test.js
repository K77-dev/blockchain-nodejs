const { Blockchain, Block } = require("../blockchain");

describe("Blockchain functionality", () => {
  test("should create a genesis block", () => {
    const blockchain = new Blockchain();
    const genesisBlock = blockchain.chain[0];
    expect(genesisBlock).toHaveProperty("index", 0);
    expect(genesisBlock).toHaveProperty("data", "Bloco Gênesis");
  });

  test("should add a block to the chain", () => {
    const blockchain = new Blockchain();
    blockchain.minePendingTransactions("miner-address");
    expect(blockchain.chain.length).toBe(2); // Genesis block + mined block
  });

  test("should validate the blockchain", () => {
    const blockchain = new Blockchain();
    blockchain.minePendingTransactions("miner-address");
    expect(blockchain.isChainValid()).toBe(true);
  });

  test("should calculate balance of an address", () => {
    const blockchain = new Blockchain();
    blockchain.createTransaction({
      from: "address1",
      to: "address2",
      amount: 50,
    });
    blockchain.minePendingTransactions("miner-address");
    const balance = blockchain.getBalanceOfAddress("address2");
    expect(balance).toBe(50);
  });
});
