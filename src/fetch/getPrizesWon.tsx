// fetch/getPrizes.ts
import { ADDRESS } from '../constants/address'; // Ensure you have the correct address import

const SUBGRAPH_URL = ADDRESS.PRIZEPOOLSUBGRAPH;

export const fetchPrizes = async (winnerAddress: string) => {
  const query = `
    {
      prizeClaims(where: { winner: "${winnerAddress}", payout_gt: 0, prizeVault: "${ADDRESS.VAULT.ADDRESS}" }) {
        id
        payout
        timestamp
        txHash
        prizeVault {
          id
        }
      }
    }
  `;

  try {
    const response = await fetch(SUBGRAPH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error('Error from subgraph:', json.errors);
      throw new Error('Error fetching prize claims');
    }

    // Check if there are prize claims or not
    if (!json.data || !json.data.prizeClaims || json.data.prizeClaims.length === 0) {
      return []; // No prize claims found
    }

    return json.data.prizeClaims;
  } catch (error) {
    console.error('Error fetching prizes:', error);
    throw error;
  }
};
