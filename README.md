# Print shop integration

This repository has all required libraries and example code
to integrate Verse and ETH artworks claims for the website.

Here we provide a simple example that will render owned artworks
in HTML.

## Installing libraries

There are two files needed to be included in the project:
- `ethereum-bundle/ethereum.min.js`: contains libraries for
  Ethereum integration (`wagmi` and `web3modal`)
- `lib/verse-auth.js`: contains Verse authentication library

There is also `jquery`, but it is used only for example project,
**it is not required for integration to work**.

So libraries can be just added to HTML:
```html
<script type="text/javascript" src="./lib/verse-auth.js"></script>
<script type="text/javascript" src="./ethereum-bundle/ethereum.min.js"></script>
```

## Usage

You can check `index.js` for a full example. Some most important code
snippets will be referred below.

### Ethereum integration

We are using [web3modal](https://github.com/WalletConnect/web3modal) which is a great way to connect
Ethereum wallet via different providers.

```javascript
/*
 * zancan contract addresses on Ethereum.
 * Simply add a new address in the future to check that contract.
 */
const zancanContractsETH = [
  /* refer index.js for code */
];

// requests NFTs by chunks
async function getNFTsByWalletAddressWithCursor(address, cursor) {
  /* refer index.js for code */
}

// requests all NFTs for a wallet address
async function getNFTsByWalletAddress(address) {
  /* refer index.js for code */
}

// converts NFT data from SimpleHash to our metadata format
function constructMetadataFromEth(nftData) {
  /* refer index.js for code */
}

// propting user to connect his wallet using `web3modal`
function connectWallet() {
  /* refer index.js for code */
}
```

To inject it into your code, simply use:
```javascript
const address = await connectWallet()

if (address) {
  // all good, wallet was connected
} else {
  console.log("metamask address could not been obtained");
  return;
}

let nfts = await getNFTsByWalletAddress(address);
let ethMetada = nfts.map(constructMetadataFromEth);

// do anything needed with metadata
renderArtworks(ethMetada);
```

### Verse integration

Preparation is easier for Verse integration:

```javascript
const verseAuthInstance = new window.VerseAuth();

const zancanArtworksVerse = [
  // Landscape with Carbon Offset, 2022
  "98fb4c61-9ebc-4f28-bf47-65cc3f3537e3",

  // Landscape with Carbon Capture, 2022
  "cb00c542-6b5d-43f4-b5d9-7e2781f498aa",

  // Rapture Captured, 2022
  "be5b9a9d-90c1-4675-a61b-560de10ce366",
];

function getZancanArtworks(editions) {
  /* refer index.js for code */
}
```

To fetch additions simply use:
```javascript
await verseAuthInstance.authorise()
if (!verseAuthInstance.isAuthorised()) {
  return
}

// all good, user is authorised

// fetch editions
const result = await verseAuthInstance.getUserEditions()
// map them to our metadata format
let verseMetadata = getZancanArtworks(result);

// do anything needed with metadata
renderArtworks(verseMetadata);
```

### Data format

After mapping you will receive following data format:
```javascript
const data = {
  artworkNumber: "34",  // basically edition number
  collection: "Artwork Title", // name of collection
  editionId: "...", // id of edition either or Verse or Ethereum
  name: `Artwork Title #34`, // title + edition number
  previewImage: "https://...", // ready to use edition image
}
```

## Structure notes

We have quite simple Webpack setup because it's much easier
to bundle `wagmi` and `web3modal` this way.

There are also two directories:
- `ethereum-bundle` is `wagmi` + `web3modal`
- - `lib` has outer-produced libraries (there were built not within this project),
- it is stored in a separate directory so it won't de overwritten by `yarn build`
