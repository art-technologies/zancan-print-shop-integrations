import { configureChains, createClient } from '@wagmi/core'
import { mainnet } from '@wagmi/core/chains'
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'

// 1. Define constants
const projectId = 'f63790b2e4b7495267c9030c4a0cb717'
const chains = [mainnet]

// 2. Configure wagmi client
const { provider } = configureChains(chains, [walletConnectProvider({ projectId })])
const wagmiClient = createClient({
    connectors: [...modalConnectors({ appName: 'Zancan Shop', chains })],
    provider
})

// 3. Create ethereum and modal clients
const ethereumClient = new EthereumClient(wagmiClient, chains)
const web3Modal = new Web3Modal(
    {
        projectId,
    },
    ethereumClient
)

window.wagmiClient = wagmiClient
window.ethereumClient = ethereumClient
window.web3Modal = web3Modal
