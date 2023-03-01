/**
 * ============= ETHEREUM INTEGRATION BEGIN =============
 */

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

// requests NFTs by chunks
async function getNFTsByWalletAddressWithCursor(address, cursor) {
  const contract_addresses_delim = zancanContractsETH.join(",");
  let url = `https://api.simplehash.com/api/v0/nfts/owners?chains=ethereum&wallet_addresses=${address}&contract_addresses=${contract_addresses_delim}&limit=50`;
  if (cursor != "" && cursor != null) {
    url = cursor;
  }

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "X-API-KEY": atob(
        "YXJ0dGVjaG5vbG9nX3NrXzNlMGUzMDBjLWE4ODMtNDNlZS1iZjUyLTMzZGE1YWI3MGU1Ml9uZHpseGZ5Y3Foa3MzOTVv"
      ),
    },
  });
  const data = await response.json();
  return data;
}

// requests all NFTs for a wallet address
async function getNFTsByWalletAddress(address) {
  let nfts = [];
  let cursor = "";
  while (cursor != null) {
    const data = await getNFTsByWalletAddressWithCursor(address, cursor);
    nfts.push(...data.nfts);
    cursor = data.next;
  }
  return nfts;
}

// converts NFT data from SimpleHash to our metadata format
function constructMetadataFromEth(nftData) {
  return {
    collection: nftData.collection.name,
    contract_address: nftData.contract_address,
    previewImage: nftData?.previews?.image_medium_url || "",
    hash: nftData?.extra_metadata?.hash || "",
    generator: nftData?.extra_metadata?.animation_original_url || "",
    name: nftData.name,
    artworkNumber: (nftData.name.match(/\d+/g) || "").join(""),
    editionId: nftData.token_id,
  };
}

// propting user to connect his wallet using `web3modal`
function connectWallet() {
  return new Promise((resolve) => {
    ethereumClient.watchAccount((account) => {
      if (account?.status === "connected") {
        resolve(account.address)
      }
    })
    web3Modal.openModal();
  })
}

/**
 * ============= ETHEREUM INTEGRATION END =============
 */

/**
 * ============= VERSE WEBSITE INTEGRATION BEGIN =============
 */

const verseAuthInstance = new window.VerseAuth();

const zancanArtworksVerse = [
  // Landscape with Carbon Offset, 2022
  "98fb4c61-9ebc-4f28-bf47-65cc3f3537e3",

  // Landscape with Carbon Capture, 2022
  "cb00c542-6b5d-43f4-b5d9-7e2781f498aa",

  // Rapture Captured, 2022
  "be5b9a9d-90c1-4675-a61b-560de10ce366",
];

// converts NFT data from Verse to our metadata format
function getZancanArtworks(editions) {
  return editions
      .filter((edition) => zancanArtworksVerse.includes(edition.artwork.id))
      .map((edition) => ({
        artworkNumber: `${edition.editionNumber}`,
        collection: edition.artwork.title,
        editionId: edition.id,
        name: `${edition.artwork.title} #${edition.editionNumber}`,
        previewImage: edition.assetUrl,
      }))
}

/**
 * ============= VERSE WEBSITE INTEGRATION END =============
 */

function renderArtworks(editions) {
  const resultContainer = document.getElementById("results")
  if (editions.length === 0) {
    resultContainer.innerHTML = "No editions found"
    return
  }

  resultContainer.innerHTML = editions.map((edition) => {
    return `<div style="display: flex; align-items: center; margin-top: 4px;">
            <img src="${edition.previewImage}" style="width: 100px; height: 100px; object-fit: contain;" />
            <span style="margin-left: 8px;">${edition.name}</span>
        </div>`
  }).join("")
}

jQuery(function () {
  const ethBtn = $("#login-metamask")
  ethBtn.on("click", async function () {
    const address = await connectWallet()
    // uncomment this wallet to test
    // const address = "0xc6893eeb690596e44f6c8668990a5cD7B8B1cEdb";

    if (address) {
      ethBtn.text("Ethereum Connected")
      ethBtn.prop('disabled', true);
    } else {
      console.log("metamask address could not been obtained");
      return;
    }

    let nfts = await getNFTsByWalletAddress(address);
    let ethMetada = nfts.map(constructMetadataFromEth);
    renderArtworks(ethMetada);
  });

  const verseBtn = $("#login-verse")
  verseBtn.on("click", async function () {
    await verseAuthInstance.authorise()
    if (verseAuthInstance.isAuthorised()) {
      verseBtn.text("Verse Connected")
      verseBtn.prop('disabled', true);
    }

    const result = await verseAuthInstance.getUserEditions()
    let verseMetadata = getZancanArtworks(result);
    renderArtworks(verseMetadata);
  });
});
