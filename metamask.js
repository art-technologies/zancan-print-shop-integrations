/*
 * zancan contract addresses on Ethereum.
 * Simply add a new address in the future to check that contract.
 */
const zancanContractsETH = [
  // Rapture Captured
  "0xec43e92046c1527586dfaf02031622c30af9a1d6",

  // Landscape with Carbon Capture
  "0x850d754a640f640b8d9844518f584ee131a57c9d",
];

// Get user address from Metamask address. If user has no Metamask installed returns `undefined`
async function getMetamaskAddress() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    return address;
  } catch (error) {
    return undefined;
  }
}

async function getNFTsByWalletAddressWithCursor(address, cursor) {
  const contract_addresses_delim = zancanContractsETH.join(",");
  const response = await fetch(
    `https://api.simplehash.com/api/v0/nfts/owners?chains=ethereum&wallet_addresses=${address}&contract_addresses=${contract_addresses_delim}&cursor=${cursor}&limit=50`,
    {
      headers: {
        accept: "application/json",
        "X-API-KEY": atob(
          "YXJ0dGVjaG5vbG9nX3NrXzNlMGUzMDBjLWE4ODMtNDNlZS1iZjUyLTMzZGE1YWI3MGU1Ml9uZHpseGZ5Y3Foa3MzOTVv"
        ),
      },
    }
  );
  const data = await response.json();
  return data;
}

async function getNFTsByWalletAddress(address) {
  let nfts = [];
  let cursor = "";
  while (cursor != null) {
    const data = await getNFTsByWalletAddressWithCursor(address);
    nfts.push(...data.nfts);
    cursor = data.next;
  }
  return nfts;
}

function constructMetadata(nftData) {
  return {
    collection: nftData.collection.name,
    contract_address: nftData.contract_address,
    previewImage: nftData?.previews?.image_medium_url || "",
    hash: nftData?.extra_metadata?.hash || "",
    generator: nftData?.extra_metadata?.animation_original_url || "",
    name: nftData.name,
  };
}

jQuery(function () {
  $("#login-metamask").on("click", async function () {
    // const address = await getMetamaskAddress();
    const address = "0x6E92b35679A31006b46A72BA8B5275310F4F718b";

    if (address == undefined) {
      console.log("metamask address could not been obtained");
      return;
    }

    let nfts = await getNFTsByWalletAddress(address);
    let nftMetada = nfts.map(constructMetadata);
    console.log(nftMetada);
  });
});
